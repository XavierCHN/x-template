'use strict';

const walk = require('walk');
const fs = require('fs');
const anyMatch = require('anymatch');
const path = require('path');

const packageJson = require('../package.json');
const settings = packageJson.dota_developer.publish_options;
const walker = walk.walk('game');
const excludeFiles = settings.excludeFiles;
const encryptFiles = settings.encryptFiles;

let mode = process.argv[2];
const dedicatedServerKey =
    mode == `release`
        ? settings.encryptDedicatedServerKeyRelease
        : mode == `release_test`
        ? settings.encryptDedicatedServerKeyRelease_Test
        : settings.encryptDedicatedServerKeyTest;
const exec = require('child_process').exec;

const getPublishPath = source => source.replace(/^game/, 'publish');

let encryptCount = 0;
walker
    .on('file', (root, fileStats, next) => {
        const fileName = path.join(root, fileStats.name);
        if (anyMatch(excludeFiles, fileName)) {
            // ignore the files we dont want to publish
            console.log(`[publish.js] ignore filtered file ->${fileName}`);
        } else {
            if (!fs.existsSync(getPublishPath(root))) {
                fs.mkdirSync(getPublishPath(root), { recursive: true });
                console.log(`[publish.js] [create-path] ->${root}`);
            }
            if (anyMatch(encryptFiles, fileName)) {
                exec(`lua scripts/encrypt_file.lua "${fileName}" "${getPublishPath(fileName)}" ${dedicatedServerKey}`, (err, out) => {
                    if (err) console.error(`[publish.js] [encrypt] ->${fileName}`, err);
                    if (!err) {
                        encryptCount++;
                        console.log(`[publish.js] [encrypt] ->${fileName} successed with key ${dedicatedServerKey}`);
                    }
                });
            } else {
                console.log(`[publish.js] [copy] ->${fileName}`);
                fs.copyFileSync(fileName, getPublishPath(fileName));
            }
            if (/addon_game_mode\.lua$/.test(fileName)) {
                const addonGameMode = fs.readFileSync(getPublishPath(fileName), 'utf8');
                const timeStamp = new Date();
                // format to yyyy-mm-dd hh:mm
                const timeStampString = `${timeStamp.getFullYear()}-${
                    timeStamp.getMonth() + 1
                }-${timeStamp.getDate()} ${timeStamp.getHours()}:${timeStamp.getMinutes()}`;
                let newAddonGameMode = `_G.PUBLISH_TIMESTAMP = "${timeStampString}"\n\n` + addonGameMode;
                if (mode == `release_test`) {
                    newAddonGameMode = `_G.ONLINE_TEST_MODE = true\n\n` + newAddonGameMode;
                }
                fs.writeFileSync(getPublishPath(fileName), newAddonGameMode);
            }
        }
        next();
    })
    .on(`end`, () => {
        console.log(
            `发布完成，发布模式是 ${
                mode == `release` ? `正式发布` : mode == `release_test` ? `在线测试` : `本地测试`
            }\n其中${encryptCount}个Lua文件使用 ${dedicatedServerKey} 加密!\n正在启动dota2，\n如果是测试发布请查看游戏运行是否正常！如果是正式发布请直接上传`
        );
    });
