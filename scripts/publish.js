console.log('publish script start to copy and encrypt files');

const fs = require('fs-extra');
const path  = require('path');
const aesjs = require('aes-js');
const { read_all_files, read_sub_directories } = require('./utils');
const packageJson = require('../package.json');
const encrypt_key = packageJson.encrypt_key;
const encryptPath = packageJson.encrypt_file_paths;
const notCopyPath = packageJson.notcpoy_file_paths;

if (!(encrypt_key == null || encrypt_key == '')){
    console.log('ignore encryption, the encrypt_key field is not defined in package.json');
}
const encrypt_content = (!(encrypt_key == null || encrypt_key == ''))? 
    (content) => { return content; }:
    (content) => {
        
        return content;
    };

function copyDir(src, dist, omit, bEncrypt, callback) {
    fs.access(dist, function (err) {
        if (err) {
            // 目录不存在时创建目录
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
        if (err) return callback(err);

        fs.readdir(src, function (err, paths) {
            if (err) return callback(err);

            paths.forEach(function (dir) {
                var _src  = src  + '/' + dir;
                var _dist = dist + '/' + dir;
                fs.stat(_src, function (err, stat) {
                    if (err) return callback(err);
                    if (stat.isDirectory()) return copyDir(_src, _dist, omit, bEncrypt, callback);
                    if (stat.isFile()) {
                        var bomit = !omit(_src);
                        console.log( bomit ? 'check:':' omit:', _path);
                        if (bomit) {
                            let content = fs.readFileSync(_src);
                            if (bEncrypt(_src)) content = encrypt_content(content);
                            fs.writeFileSync(_dist, content);
                        }

                        callback(null, dist);
                    } 
                });
            });
        });
    }
}

(async () => {
    console.log('publish script start to copy and encrypt files');
    copyDir(
        'game',
        'publish',
        (_path) => {
            // omit the _path
            // console.log('omit?', _path);
            // let ext = path.extname(_path);
            // if (ext == '.ts'  ) return true;
            // if (ext == '.bin' ) return true;
            // if (ext == '.cfg' ) return true;
            // if (ext == '.py'  ) return true;
            // if (ext == '.json') return true;

            for (let i in notCopyPath){
                if (_path.indexOf(notCopyPath[i]) != -1) return true;
            }
            
            return false;
        },
        (_path) => {
            for (let i in encryptPath){
                if (_path.indexOf(encryptPath[i]) != -1) return true;
            }
            return false;
        },
        (err, _path) => {
            if (err) {
                console.log(err);
                return;
            }
            // console.log('done publish file=>', _path);
        }
    );
    console.log('done publish!');
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
