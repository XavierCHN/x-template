import gulp from 'gulp';
import * as dotax from 'gulp-dotax';
import path from 'path';

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
const cSheetToKV = () => {
    return gulp
        .src(`${paths.excels}/*.{xlsx,xls}`)
        .pipe(
            dotax.sheetToKV({
                sheetsIgnore: '^__', // 忽略以两个下划线开头的sheet
                indent: `	`, // 自定义缩进
            })
        )
        .pipe(gulp.dest(paths.kv));
};

/**
 * @description 将kv文件转换为panorama使用的js文件，你需要在webpack.config.js中配置相应的loader
 * @description Convert your kv file to panorama js file, you need to configure the loader in webpack.config.js
 */
const cKVToJS = () => {
    return gulp
        .src(`${paths.kv}/**/*.{kv,txt}`)
        .pipe(dotax.kvToJS())
        .pipe(gulp.dest(paths.panorama_json))
        .pipe(gulp.dest(paths.src_json));
};

/**
 * @description 从 kv 文件中提取所有的description，你可以使用 customPrefix 和 customSuffix 之类的参数来指定自己的前缀和后缀
 * @description Extract all description from kv file, you can use customPrefix and customSuffix to specify your prefix and suffix
 */
const cKVToLocal = () => {
    return gulp.src(`${paths.kv}/**/*.{kv,txt}`).pipe(
        dotax.kvToLocalsCSV(`${paths.game_resource}/addon.csv`, {
            customPrefix: (key, data, path) => {
                if (data.BaseClass && /ability_/.test(data.BaseClass)) {
                    if (data.ScriptFile && data.ScriptFile.startsWith('abilities/combos/')) {
                        return 'dota_tooltip_ability_combo_';
                    } else if (data.ScriptFile && /^/.test(data.ScriptFile)) {
                        return 'dota_tooltip_ability_chess_ability_';
                    } else {
                        return 'dota_tooltip_ability_';
                    }
                }
                return '';
            },
            customSuffix: (key, data, path) => {
                let suffix = [''];
                if (data.ScriptFile && data.ScriptFile.startsWith('abilities/combos/')) {
                    suffix = ['_description'];
                    let maxLevel = data.MaxLevel;
                    if (maxLevel) {
                        suffix = suffix.concat(
                            Array.from({ length: maxLevel }, (_, i) => `_level${i + 1}`)
                        );
                    }
                }
                return suffix;
            },
            exportAbilityValues: false,
        })
    );
};

/**
 * @description 将 addon.csv 中的本地化文本转换为 addon_*.txt 文件，这个 task 建议 kv 写完了之后再运行一次即可
 * @description Convert addon.csv local text to addon_*.txt file， this task is recommended to run after kv is finished
 *
 */
const cCSVToLocalization = () => {
    return gulp
        .src(`${paths.game_resource}/addon.csv`)
        .pipe(dotax.csvToLocals(paths.game_resource));
};

/**
 * @description 将现有的 addon_*.txt 文件转换为 addon.csv 文件，这个 task 是为了使这个task适配你原有的开发方式，如果是重新开发，则无需运行这个task
 * @description Convert addon_*.txt file to addon.csv file, this task is for adapting your original development method, if you are re-developing, you don't need to run this task
 */
const cLocalsToCSV = () => {
    return dotax.localsToCSV(
        `${paths.game_resource}/addon_*.txt`,
        `${paths.game_resource}/addon.csv`
    );
};

/**
 * 将panorama/images目录下的jpg,png,psd文件集合到 dest 目录中的 image_precache.css文件中
 * 使用这个 task ，你可以在 game setup 阶段的时候，将所有的图片都编译而不用自己写
 */
gulp.task(`img_pcache`, () => {
    return gulp
        .src(`content/panorama/images/**/*.{jpg,png,psd}`)
        .pipe(dotax.imagePrecacche(`content/panorama/images/`))
        .pipe(gulp.dest(path.join(paths.panorama, `src/utils`)));
});
gulp.task('img_pcache:watch', () => {
    return gulp.watch(`content/panorama/images/**/*.{jpg,png,psd}`, gulp.series('img_pcache'));
});

// 以下的task，顾名思义即可
gulp.task('local', cLocalsToCSV);

gulp.task('sheetToKV', cSheetToKV);
gulp.task('sheetToKV:watch', () => {
    return gulp.watch(`${paths.excels}/*.{xlsx,xls,csv}`, cSheetToKV);
});

gulp.task('kvToJS', cKVToJS);
gulp.task('kvToJS:watch', () => {
    return gulp.watch(`${paths.kv}/**/*.{kv,txt}`, cKVToJS);
});

gulp.task('kvToLocal', cKVToLocal);
gulp.task('kvToLocal:watch', () => {
    return gulp.watch(`${paths.kv}/**/*.{kv,txt}`, cKVToLocal);
});

gulp.task('csvToLocalization', cCSVToLocalization);
gulp.task('csvToLocalization:watch', () => {
    return gulp.watch(`${paths.game_resource}/addon.csv`, cCSVToLocalization);
});

gulp.task('predev', gulp.series('sheetToKV', 'kvToJS', 'csvToLocalization', 'img_pcache'));
gulp.task('dev', gulp.parallel('sheetToKV:watch', 'csvToLocalization:watch', 'img_pcache:watch'));
gulp.task('build', gulp.series('predev', 'csvToLocalization'));
gulp.task('jssync', gulp.series('sheetToKV', 'kvToJS'));
gulp.task('kvl', gulp.series('kvToLocal'));

// 编译发布版本
gulp.task('prod', gulp.series('sheetToKV', 'kvToJS', 'csvToLocalization', 'img_pcache'));
