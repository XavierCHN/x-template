'use strict';

const walk = require('walk');
const fs = require('fs');
const anyMatch = require('anymatch');
const path = require('path');

const config = require('./addon.config.js');
const walker = walk.walk('game');
const excludeFiles = config.exclude_files;
const encryptFiles = config.encrypt_files;

const color = require('cli-color');
const readline = require('readline');

const { launchDota2 } = require('./launchDota2.js');

let mode = process.argv[2];
const dedicatedServerKey =
    mode == `release`
        ? config.encryptDedicatedServerKeyRelease
        : mode == `release_test`
        ? config.encryptDedicatedServerKeyRelease_Test
        : config.encryptDedicatedServerKeyTest;
const exec = require('child_process').exec;

const getPublishPath = source => source.replace(/^game/, 'publish');

let stats = {}; // stastics file count of copy, ignore and encrypted
walker
    .on('file', (root, fileStats, next) => {
        const fileName = path.join(root, fileStats.name);
        if (anyMatch(excludeFiles, fileName)) {
            // ignore the files we dont want to publish
            console.log(`[publish.js] ignore filtered file ->${fileName}`);
            stats.ignore = stats.ignore ? stats.ignore + 1 : 1;
        } else {
            if (!fs.existsSync(getPublishPath(root))) {
                fs.mkdirSync(getPublishPath(root), { recursive: true });
                console.log(`[publish.js] [create-path] ->${root}`);
            }
            if (anyMatch(encryptFiles, fileName)) {
                exec(`lua scripts/encrypt_file.lua "${fileName}" "${getPublishPath(fileName)}" ${dedicatedServerKey}`, (err, out) => {
                    if (err) console.error(`[publish.js] [encrypt] ->${fileName}`, err);
                    if (!err) {
                        stats.encrypted = stats.encrypted ? stats.encrypted + 1 : 1;
                        console.log(`[publish.js] [encrypt] ->${fileName} successed with key ${dedicatedServerKey}`);
                    }
                });
            } else {
                console.log(`[publish.js] [copy] ->${fileName}`);
                fs.copyFileSync(fileName, getPublishPath(fileName));
                stats.copy = stats.copy ? stats.copy + 1 : 1;
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
    .on(`end`, async () => {
        console.log(
            `发布完成，发布模式是 ${color.red(mode == `release` ? `正式发布` : mode == `release_test` ? `在线测试` : `本地测试`)}\n其中${
                stats.encrypted ?? 0
            }个Lua文件使用 ${color.red(dedicatedServerKey)} 加密!\n正在启动dota2，\n如果是测试发布请查看游戏运行是否正常！如果是正式发布请直接上传`
        );
        console.log(`[文件数量统计] -> ${JSON.stringify(stats, null, 4)}`);

        const addon_name = config.addon_name;

        if (mode != `release` && mode != `release_test`) {
            // 本地测试模式，要求用户输入地图名称
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            rl.question(color.green(`请输入你要测试的地图名称：`), async answer => {
                console.log(color.red(`正在启动dota2，请查看加密后的游戏是否正常运行！`));
                await launchDota2(`${addon_name}_publish`, answer);
            });
            return;
        }

        // 正式发布模式，直接启动dota2
        console.log(color.red(`启动正式版dota2，如果已运行过test，请直接上传游戏，要注意分辨到底是测试图还是正式图`));
        await launchDota2(`${addon_name}_publish`);
    });
