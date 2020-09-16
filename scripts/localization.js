const fs = require('fs-extra');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const { read_all_files, read_sub_directories } = require('./utils');

const localization_path = 'localization';

function combine_localization_files() {
    console.log('should combine localization files');
    // 编译所有的语言文件
    let languages = read_sub_directories(localization_path);
    languages.forEach((dir) => {
        let language = dir.replace(/^.*[\\\/]/, '');
        let lang_file = { Language: language, Tokens: {} };

        let all_files = read_all_files(dir);
        all_files.forEach((file) => {
            let tokens = keyvalues.decode(fs.readFileSync(file, 'utf-8').replace(/\\n/g, '___x___combine____n___'));
            for (let token in tokens) {
                lang_file.Tokens[token] = tokens[token];
            }
        });

        let output_path = 'game/resource/addon_' + language.toLowerCase() + '.txt';
        if (!fs.existsSync('game/resource')) fs.mkdirSync('game/resource');
        fs.writeFileSync(output_path, keyvalues.encode({ lang: lang_file }).replace(/___x___combine____n___/g, '\\n'));
        console.log('write to language file finished =>', output_path);
    });
}

(async () => {
    combine_localization_files();
    program.option('-w, --watch', 'Watch Mode').parse(process.argv);
    if (program.watch) {
        console.log('start with watch mode');
        chokidar.watch(localization_path).on('change', (event, path) => {
            combine_localization_files();
        });
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
