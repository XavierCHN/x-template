const fs = require('fs-extra');
const path = require('path');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const { read_all_files, read_sub_directories } = require('./utils');

let npc_path = 'game/scripts/npc';
function kv_js_sync() {
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
        out_put += 'GameUI.CustomUIConfig().' + file_name + ' = ' + JSON.stringify(kv) + '\n';
    });
    let content_path = 'content/panorama/scripts/';
    if (!fs.existsSync(content_path)) {
        console.log('creating none existing content kv path=>', content_path);
        fs.mkdirSync(content_path);
    }
    let output_path = content_path + 'sync_keyvalues.js';
    fs.writeFileSync(output_path, out_put);
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
