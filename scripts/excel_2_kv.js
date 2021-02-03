const fs = require('fs-extra');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const path = require('path');
const xlsx = require('node-xlsx');
const { read_all_files, read_sub_directories } = require('./utils');

// 需要读取的excel路径
const excel_path = 'excels';
const kv_path = 'game/scripts/npc';

String.format = function () {
    var param = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        param.push(arguments[i]);
    }
    var statment = param[0]; // get the first element(the original statement)
    param.shift(); // remove the first element from array
    return statment.replace(/\{(\d+)\}/g, function (m, n) {
        return param[n];
    });
};

function row_data_to_dict(dct, key_names, row_data, i, parent_name) {
    if (parent_name == null) parent_name = '';
    while (i < row_data.length && i < key_names.length) {
        key_name = key_names[i];
        if (key_name == null) {
            i++;
            continue;
        }
        key_name = key_name.toString();
        if (key_name.indexOf('[{]') >= 0) {
            i++;
            let pn = key_name.replace('[{]', '');
            let ret_val = row_data_to_dict({}, key_names, row_data, i, pn);
            dct[pn] = ret_val.dct;
            i = ret_val.i + 1;
        } else if (key_name.indexOf('[}]') >= 0) {
            return { dct: dct, i: i };
        } else if (key_name != null && key_name != '') {
            data = row_data[i];

            const clean_data = (da) => {
                if (!isNaN(data)) {
                    let number = parseFloat(da);
                    if (number % 1 != 0) da = number.toFixed(4);
                }
                return da.toString();
            };

            // 处理AttachWearables
            if (parent_name == 'AttachWearables' && data != '' && data != null) {
                dct[key_name] = { ItemDef: clean_data(data) };
            } else if (parent_name == 'AbilitySpecial' && data != '' && data != null) {
                // 写入ability specials
                let datas = data.toString().split(' ');
                let has_float = false;
                let special_key_name;
                datas.forEach((d) => {
                    if (isNaN(d)) special_key_name = d;
                    else if (parseFloat(d) % 1 != 0) has_float = true;
                });
                data = clean_data(data)
                    .replace(special_key_name + ' ', '')
                    .replace(special_key_name, '');
                dct[key_name] = { var_type: has_float ? 'FIELD_FLOAT' : 'FIELD_INTEGER', [special_key_name != null ? special_key_name : 'var_' + key_name]: data };
            } else if (data != null && data !== '') {
                dct[key_name] = clean_data(data);
            } else if (key_name.indexOf('Ability') >= 0) {
                // 这里要注意，只要定义了技能的key，哪怕没有数据，也要填一个"”，否则不能正确覆盖为空技能
                dct[key_name] = '';
            }
            i++;
        }
    }
    return { dct: dct, i: i };
}

function col_excel_to_kv(sheet) {
    console.log('single excel to kv');
    let kv_data = { XLSXContent: {} };
    for (i = 2; i < sheet.data.length; ++i) {
        let row_data = sheet.data[i];
        let main_key = row_data[0];
        let value = row_data[1];
        if (main_key == null) continue;
        kv_data.XLSXContent[main_key] = value.toString();
    }
    return kv_data;
}

function xy_excel_to_kv(sheet) {
    let key_row = sheet.data[1]; // 第二行存键名
    let kv_data = { XLSXContent: {} };
    for (i = 2; i < sheet.data.length; ++i) {
        let row_data = sheet.data[i];
        let main_key = row_data[0];
        if (main_key == null) continue;
        let ret_val = row_data_to_dict({}, key_row, row_data, 1);
        kv_data.XLSXContent[main_key] = ret_val.dct;
    }
    return kv_data;
}

function single_excel_to_kv(file) {
    if ((path.extname(file) != '.xlsx' && path.extname(file) != '.xls') || file.indexOf('~$') >= 0) {
        console.log('excel 2 kv compiler ingore non-excel file=>', file);
        return;
    }
    let sheets = xlsx.parse(file);

    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    if (nrows < 3) {
        console.log('ignore empty file=>', file, 'REQUIRES AT LEAST 3 LINES(comment, key data)');
        return;
    }

    if (sheet.data[1][0] == 'vertical_keys') {
        kv_data = col_excel_to_kv(sheet);
    } else {
        kv_data = xy_excel_to_kv(sheet);
    }

    if (Object.keys(kv_data.XLSXContent).length <= 0) return;
    let outpath = file.replace(excel_path, kv_path).replace('.xlsx', '.txt');
    let parent_i = outpath.lastIndexOf('/');
    let out_dir = outpath.substr(0, parent_i);
    if (!fs.existsSync(out_dir)) fs.mkdirSync(out_dir);
    fs.writeFileSync(outpath, "// generate with Xavier's kv generator https://github.com/XavierCHN/x-template\n" + keyvalues.encode(kv_data));
    console.log('success xlsx->kv', outpath, ', total items count ->', Object.keys(kv_data.XLSXContent).length);
}

const all_excel_to_kv = async (path) => {
    const files = read_all_files(excel_path);
    files.forEach((file) => {
        single_excel_to_kv(file);
    });
};

(async () => {
    all_excel_to_kv();
    program.option('-w, --watch', 'Watch Mode').parse(process.argv);
    if (program.watch) {
        console.log('start with watch mode');
        chokidar.watch(excel_path).on('change', (file) => {
            single_excel_to_kv(file);
        });
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
