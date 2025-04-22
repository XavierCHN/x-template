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
                        keyRowNumber: 2, // 自定义键值对的键所在的行数
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
gulp.task('prod', gulp.series('predev'));
