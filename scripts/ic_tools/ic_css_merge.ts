import * as path from "path";
import * as fs from "fs";
import * as gulp from "gulp";
import * as chokidar from "chokidar";

const program = require("commander");
const config = require("./config").IcToolsConfig.CssMerge;
const {read_all_files} = require("../utils");
const concat = require("gulp-concat");
const stripCssComments = require('gulp-strip-css-comments');
const sass = require('gulp-sass')(require('sass'));

const contentPath = "content/panorama/src";
const outPath = `content/panorama/styles/${config.OutCssFolderName}`;

//First Line Comment Name
const rootCommentName = config.RootCommentName;

const fileNameReg = new RegExp(`.*${rootCommentName}\\s+([(\\w+)\\s]*)`);

function _getFNames(path: string): string[] | undefined
{
    const file = fs.readFileSync(path, "utf-8");

    const firstLine = file.substring(0, file.indexOf("\r\n"));

    const result = fileNameReg.exec(firstLine);

    if (result !== null && result.length >= 2)
    {
        return result[1].split(" ");
    }

    return undefined;
}

function _cssMerge()
{
    const files = read_all_files(contentPath);
console.log("Files:",files)
    const dict: { [name: string]: string[] } = {};

    for (const file of files)
    {
        if (file.includes(outPath))
            continue;

        if (!_isCssFile(file))
            continue;

        const names = _getFNames(file);

        if (!names)
            continue;

        for (let name of names)
        {
            if (!dict[name])
                dict[name] = [];

            dict[name].push(file);
        }
    }

    if (!fs.existsSync(outPath))
        fs.mkdirSync(outPath,{recursive :true});

    const keys = Object.keys(dict);

    for (let key of keys)
    {
        const files = dict[key];

        gulp.task(key, () =>
        {
            console.log(`IcCSSMerge ${key}`);

            return gulp.src(files, {nosort:true})
                .pipe(concat(`${key}.scss`))
                .pipe(sass().on("error", sass.logError))
                .pipe(stripCssComments())
                .pipe(gulp.dest(outPath));
        });
    }

    if (config.ClearDir)
        fs.rmdirSync(outPath, {recursive:true});

    gulp.parallel(...keys)(error => {});
}

function _isCssFile(filePath: string)
{
    const ext = path.extname(filePath);

    return ext === '.css' || ext === '.scss';
}

(async () =>
{
    _cssMerge();
    program.option('-w, --watch', 'Watch Mode').parse(process.argv);
    if (program.watch)
    {
        console.log('IcCSSMerge start with watch mode');
        chokidar.watch(contentPath).on('change', (event, path) =>
        {
            if (!_isCssFile(event))
                return

            //todo can do the following optimization, only re-merge the file related files
            _cssMerge();
        });
    }
})().catch((error) =>
{
    console.error(error);
    process.exit(1);
});
