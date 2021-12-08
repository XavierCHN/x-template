const fs = require('fs-extra');
const path = require('path');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const { read_all_files, read_sub_directories } = require('./utils');
const JsonToTS = require("json-to-ts");

let npc_path = 'game/scripts/npc';
const typeNameReg = new RegExp("declare\\s+interface\\s+(\\w*)");
function kv_js_sync() {

    const checkAndCreateDir = (dirPath) =>
    {
        if (!fs.existsSync(dirPath)) {
            console.log('creating none existing content kv path=>', dirPath);
            fs.mkdirSync(dirPath);
        }
    }

    console.log('start to sync kv and js files');
    if (!fs.existsSync(npc_path)) {
        console.log('game/scripts/npc directory is not exist, ignore kv sync!');
        return;
    }

    let files = read_all_files(npc_path);
    let out_put = '';
    files.forEach((file) => {
        let ext = path.extname(file);
        if (!(ext == '.txt' || ext == '.kv')) {
            console.log('kv js sync script ignore change of none kv file=>', file);
            return;
        }

        let kv = keyvalues.decode(fs.readFileSync(file, 'utf-8'));
        let file_name = file.replace(/^.*[\\\/]/, '').replace(/\..*/, '');
        let json = JSON.stringify(kv);
        out_put += 'GameUI.CustomUIConfig().' + file_name + ' = ' + json + '\n';

        const declare_content_path = `content/panorama/src/declares/${file_name}.d.ts`;
        const declare_kv_type_content_path = `shared/kv/${file_name}.d.ts`;

        const types = JsonToTS(kv, {rootName:file_name});

        const addDeclare = (src) =>
        {
            const dd = "declare";

            if (src.startsWith(dd))
                return src;

            return `${dd} ${src}`;
        }

        const getTypeName = (typeCode) =>
        {
            return typeNameReg.exec(typeCode)[1];
        }

        const firstType = addDeclare(types[0]);
        checkAndCreateDir(path.dirname(declare_content_path));
        checkAndCreateDir(path.dirname(declare_kv_type_content_path));

        fs.writeFileSync(declare_content_path, firstType + "\n");

        fs.appendFileSync(declare_content_path, "declare interface CustomUIConfig"
                                                +"\n{"
                                                +`\n\t${file_name}:${getTypeName(firstType)};`
                                                +"\n}");

        fs.writeFileSync(declare_kv_type_content_path, "//@ts-nocheck\n");

        for (let i = 1; i < types.length; i++){
            const type = addDeclare(types[i]) + "\n";
            fs.appendFileSync(declare_kv_type_content_path, type);
        }
    });
    let content_path = 'content/panorama/scripts/';
    checkAndCreateDir(content_path)
    let output_path = content_path + 'sync_keyvalues.js';
    try {
        fs.writeFileSync(output_path, out_put);
    }
    catch{}
    console.log('write to', output_path, 'finished!');
}

(async () => {
    kv_js_sync();
    program.option('-w, --watch', 'Watch Mode').parse(process.argv);
    if (program.watch) {
        console.log('start with watch mode');
        chokidar.watch(npc_path).on('change', (event, path) => {
            kv_js_sync();
        });
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
