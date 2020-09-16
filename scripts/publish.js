console.log('publish script start to copy and encrypt files');

const fs = require('fs-extra');
const packageJson = require('../package.json');
const aesjs = require('aes-js');
const path = require('path');
const { read_all_files, read_sub_directories } = require('./utils');

const encrypt_content = (content) => {
    let key = packageJson.encrypt_key;
    if (key == null || key == '') {
        // console.log('ignore encryption, the encrypt_key field is not defined in package.json');
        return content;
    }
};

function copyDir(src, dist, validate, should_encrypt, callback) {
    fs.access(dist, function (err) {
        if (err) {
            // 目录不存在时创建目录
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
        if (err) {
            callback(err);
        } else {
            fs.readdir(src, function (err, paths) {
                if (err) {
                    callback(err);
                } else {
                    paths.forEach(function (dir) {
                        var _src = src + '/' + dir;
                        var _dist = dist + '/' + dir;
                        fs.stat(_src, function (err, stat) {
                            if (err) {
                                callback(err);
                            } else {
                                if (stat.isFile()) {
                                    if (!validate(_src)) {
                                    } else {
                                        let content = fs.readFileSync(_src);
                                        if (should_encrypt) content = encrypt_content(content);
                                        fs.writeFileSync(_dist, content);
                                    }

                                    callback(null, dist);
                                } else if (stat.isDirectory()) {
                                    copyDir(_src, _dist, validate, should_encrypt, callback);
                                }
                            }
                        });
                    });
                }
            });
        }
    }
}

(async () => {
    console.log('publish script start to copy and encrypt files');
    copyDir(
        'game',
        'publish',
        (_path) => {
            // validate
            console.log('validate?', _path);
            let ext = path.extname(_path);
            if (ext == '.ts') return false;
            if (ext == '.bin') return false;
            if (ext == '.cfg') return false;
            if (ext == '.py') return false;
            if (ext == '.json') return false;
            return true;
        },
        (_path) => {
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
