import gulp from 'gulp';
import * as dotax from 'gulp-dotax';
import path from 'path';
import less from 'gulp-less';
import replace from 'gulp-replace';

const paths: { [key: string]: string } = {
    excels: 'excels',
    kv: 'game/scripts/npc',
    src_json: 'game/scripts/src/json',
    panorama_json: 'content/panorama/src/json',
    panorama: 'content/panorama',
    game_resource: 'game/resource',
};

/**
 * @description 将excel文件转换为kv文件
 * @description Convert your excel file to kv file
 */
const sheet_2_kv =
    (watch: boolean = false) =>
    () => {
        const excelFiles = `${paths.excels}/**/*.{xlsx,xls}`;
        const transpileSheets = () => {
            return gulp
                .src(excelFiles)
                .pipe(
                    dotax.sheetToKV({
                        // 所有支持的参数请按住 Ctrl 点击 sheetToKV 查看，以下其他 API 也是如此
                        sheetsIgnore: '^__.*|^Sheet[1-3]$', // 忽略以两个下划线开头的sheet 和 默认生成的 Sheet1 Sheet2 Sheet3 等
                        indent: `	`, // 自定义缩进
                        addonCSVPath: `${paths.game_resource}/kv_generated.csv`, // 本地化文件路径，用以将 excel 文件中的 #Loc{}输出到addon.csv文件中去
                    })
                )
                .pipe(gulp.dest(paths.kv));
        };

        if (watch) {
            return gulp.watch(excelFiles, transpileSheets);
        } else {
            return transpileSheets();
        }
    };

/**
 * @description 将kv文件转换为panorama使用的json文件
 * @description Convert your kv file to panorama json file
 */
const kv_2_js =
    (watch: boolean = false) =>
    () => {
        const kvFiles = `${paths.kv}/**/*.{kv,txt}`;
        const transpileKVToJS = () => {
            return gulp.src(kvFiles).pipe(dotax.kvToJS()).pipe(gulp.dest(paths.panorama_json)).pipe(gulp.dest(paths.src_json));
        };

        if (watch) {
            return gulp.watch(kvFiles, transpileKVToJS);
        } else {
            return transpileKVToJS();
        }
    };

/**
 * @description 从 kv 文件中提取所有需要的本地化词条，你可以使用 customPrefix 和 customSuffix 之类的参数来指定自己的前缀和后缀
 * @description Extract all description from kv file, you can use customPrefix and customSuffix to specify your prefix and suffix
 */
const kv_to_local = () => () => {
    return gulp.src(`${paths.kv}/**/*.{kv,txt}`).pipe(
        dotax.kvToLocalsCSV(`${paths.game_resource}/addon.csv`, {
            // customPrefix: (key, data, path) => {
            //     if (data.BaseClass && /ability_/.test(data.BaseClass)) {
            //         if (data.ScriptFile && data.ScriptFile.startsWith('abilities/combos/')) {
            //             return 'dota_tooltip_ability_combo_';
            //         } else if (data.ScriptFile && /^/.test(data.ScriptFile)) {
            //             return 'dota_tooltip_ability_chess_ability_';
            //         } else {
            //             return 'dota_tooltip_ability_';
            //         }
            //     }
            //     return '';
            // },
            // customSuffix: (key, data, path) => {
            //     let suffix = [''];
            //     if (data.ScriptFile && data.ScriptFile.startsWith('abilities/combos/')) {
            //         suffix = ['_description'];
            //         let maxLevel = data.MaxLevel;
            //         if (maxLevel) {
            //             suffix = suffix.concat(
            //                 Array.from({ length: maxLevel }, (_, i) => `_level${i + 1}`)
            //             );
            //         }
            //     }
            //     return suffix;
            // },
            // exportAbilityValues: false,
        })
    );
};

/**
 * @description 将 resource/*.csv 中的本地化文本转换为 addon_*.txt 文件
 * @description Convert resource/*.csv local text to addon_*.txt file
 *
 */
const csv_to_localization =
    (watch: boolean = false) =>
    () => {
        const addonCsv = `${paths.game_resource}/*.csv`;
        const transpileAddonCSVToLocalization = () => {
            return gulp.src(addonCsv).pipe(dotax.csvToLocals(paths.game_resource));
        };
        if (watch) {
            return gulp.watch(addonCsv, transpileAddonCSVToLocalization);
        } else {
            return transpileAddonCSVToLocalization();
        }
    };

/**
 * @description 将现有的 addon_*.txt 文件转换为 addon.csv 文件，这个 task 是为了使这个task适配你原有的开发方式，如果是重新开发，则无需运行这个task
 * @description Convert addon_*.txt file to addon.csv file, this task is for adapting your original development method, if you are re-developing, you don't need to run this task
 */
const localization_2_csv = () => {
    return dotax.localsToCSV(`${paths.game_resource}/addon_*.txt`, `${paths.game_resource}/addon.csv`);
};

/**
 * 将panorama/images目录下的jpg,png,psd文件集合到 dest 目录中的 image_precache.css文件中
 * 使用这个 task ，你可以在 game setup 阶段的时候，将所有的图片都编译而不用自己写
 */
const create_image_precache =
    (watch: boolean = false) =>
    () => {
        const imageFiles = `${paths.panorama}/images/**/*.{jpg,png,psd}`;
        const createImagePrecache = () => {
            return gulp.src(imageFiles).pipe(dotax.imagePrecacche(`content/panorama/images/`)).pipe(gulp.dest(paths.panorama));
        };
        if (watch) {
            return gulp.watch(imageFiles, createImagePrecache);
        } else {
            return createImagePrecache();
        }
    };

/** compile all less files to panorama path */
const compile_less =
    (watch: boolean = false) =>
    () => {
        const lessFiles = `${paths.panorama}/src/**/*.less`;
        const compileLess = () => {
            return (
                gulp
                    .src(lessFiles)
                    .pipe(less())
                    // valve 对于 @keyframes 有特殊的格式要求，需要将 @keyframes 的名称用单引号包裹
                    .pipe(replace(/@keyframes\s*(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, name) => match.replace(name, `'${name}'`)))
                    .pipe(gulp.dest(path.join(paths.panorama, 'layout/custom_game')))
            );
        };
        if (watch) {
            return gulp.watch(lessFiles, compileLess);
        } else {
            return compileLess();
        }
    };

/**
 * start a file sserver to save/read files
 */
const fsServer = require('./scripts/fs');
const p = process.cwd();
const start_file_server = (callback: Function) => {
    const server = fsServer(p);

    server.on('file', (name: string) => {
        console.log('file: ' + name);
    });
    server.on('directory', (name: string) => {
        console.log('directory: ' + name);
    });

    server.listen(10384, () => {
        console.log('file server listening on port 10384');
        callback();
    });
};

gulp.task('start_file_server', start_file_server);

gulp.task('localization_2_csv', localization_2_csv);

gulp.task(`create_image_precache`, create_image_precache());
gulp.task('create_image_precache:watch', create_image_precache(true));

gulp.task('sheet_2_kv', sheet_2_kv());
gulp.task('sheet_2_kv:watch', sheet_2_kv(true));

gulp.task('kv_2_js', kv_2_js());
gulp.task('kv_2_js:watch', kv_2_js(true));

gulp.task('csv_to_localization', csv_to_localization());
gulp.task('csv_to_localization:watch', csv_to_localization(true));

gulp.task('compile_less', compile_less());
gulp.task('compile_less:watch', compile_less(true));

gulp.task('predev', gulp.series('sheet_2_kv', 'kv_2_js', 'csv_to_localization', 'create_image_precache'));
gulp.task(
    'dev',
    gulp.parallel('sheet_2_kv:watch', 'csv_to_localization:watch', 'create_image_precache:watch', 'kv_2_js:watch', 'compile_less:watch')
);
gulp.task('build', gulp.series('predev'));
gulp.task('jssync', gulp.series('sheet_2_kv', 'kv_2_js'));
gulp.task('kv_to_local', kv_to_local());
gulp.task('prod', gulp.series('predev'));
