// 使用 ES 模块导入
import fs from 'fs-extra';
import anyMatch from 'anymatch';
import path from 'path';
import select from '@inquirer/select';
import input from '@inquirer/input';
import config from './addon.config';
import color from 'cli-color';
import { execSync } from 'child_process';
import launchDota2 from './launchDota2';

// 递归遍历目录的函数
async function traverseDirectory(dir: string, callback: (filePath: string, stats: fs.Stats) => Promise<void>) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const filePath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await traverseDirectory(filePath, callback);
        } else {
            const fileStats = await fs.stat(filePath);
            await callback(filePath, fileStats);
        }
    }
}

(async () => {
    const mode = await select({
        message: '请选择发布模式',
        choices: [
            { name: `正式发布 PRODUCTION 对应密钥："${config.encryptDedicatedServerKeyRelease}"`, value: 'release' },
            { name: `测试发布 ONLINETEST 对应密钥："${config.encryptDedicatedServerKeyRelease_Test}"`, value: 'release_test' },
            { name: `本地测试 LOCAL TEST 对应密钥："${config.encryptDedicatedServerKeyTest}"`, value: 'test' },
        ],
    });

    const excludeFiles = config.exclude_files;
    const encryptFiles = config.encrypt_files;

    const dedicatedServerKey =
        mode === `release`
            ? config.encryptDedicatedServerKeyRelease
            : mode === `release_test`
            ? config.encryptDedicatedServerKeyRelease_Test
            : config.encryptDedicatedServerKeyTest;

    const getPublishPath = (source: string): string => source.replace(/^game/, 'publish');

    // 定义 stats 类型
    type Stats = {
        ignore?: number;
        encrypted?: number;
        copy?: number;
    };

    const stats: Stats = {}; // stastics file count of copy, ignore and encrypted

    try {
        await traverseDirectory('game', async (fileName, fileStats) => {
            if (anyMatch(excludeFiles, fileName)) {
                // ignore the files we dont want to publish
                console.log(`[忽略文件：] ->${fileName}`);
                stats.ignore = (stats.ignore ?? 0) + 1;
            } else {
                const publishRoot = path.dirname(getPublishPath(fileName));
                if (!fs.existsSync(publishRoot)) {
                    await fs.mkdir(publishRoot, { recursive: true });
                    // console.log(`[publish.js] [create-path] ->${root}`);
                }
                if (anyMatch(encryptFiles, fileName)) {
                    try {
                        execSync(`lua scripts/encrypt_file.lua "${fileName}" "${getPublishPath(fileName)}" ${dedicatedServerKey}`);
                        stats.encrypted = (stats.encrypted ?? 0) + 1;
                        console.log(`[加密文件：] ->${fileName} successed with key ${dedicatedServerKey}`);
                    } catch (err) {
                        console.error(`[加密文件：] ->${fileName}`, err);
                    }
                } else {
                    console.log(`[复制文件：] ->${fileName}`);
                    await fs.copyFile(fileName, getPublishPath(fileName));
                    stats.copy = (stats.copy ?? 0) + 1;
                }
                if (/addon_game_mode\.lua$/.test(fileName)) {
                    const addonGameMode = await fs.readFile(getPublishPath(fileName), 'utf8');
                    const timeStamp = new Date();
                    // format to yyyy-mm-dd hh:mm
                    const timeStampString = `${timeStamp.getFullYear()}-${
                        timeStamp.getMonth() + 1
                    }-${timeStamp.getDate()} ${timeStamp.getHours()}:${timeStamp.getMinutes()}`;
                    let newAddonGameMode = `_G.PUBLISH_TIMESTAMP = "${timeStampString}"\n\n` + addonGameMode;
                    if (mode === `release_test`) {
                        newAddonGameMode = `_G.ONLINE_TEST_MODE = true\n\n` + newAddonGameMode;
                    }
                    await fs.writeFile(getPublishPath(fileName), newAddonGameMode);
                }
            }
        });

        console.log(`[文件数量统计] -> ${JSON.stringify(stats, null, 4)}`);

        console.log('发布完成！');
        console.log('发布模式是:' + color.red(mode === `release` ? `正式发布` : mode === `release_test` ? `在线测试` : `本地测试`));
        console.log('正在启动dota2...');

        const addon_name = config.addon_name;

        if (mode !== `release` && mode !== `release_test`) {
            // 本地测试模式，要求用户输入地图名称
            const mapName = await input({
                message: '请输入你要测试的地图名：',
            });
            console.log(color.red(`正在启动dota2，请查看加密后的游戏是否正常运行！`));
            await launchDota2(`${addon_name}_publish`, mapName);
            return;
        }

        // 正式发布模式，直接启动dota2
        console.log(color.red(`启动正式版dota2，如果已运行过test，请直接上传游戏，要注意分辨到底是测试图还是正式图`));
        await launchDota2(`${addon_name}_publish`);
    } catch (error) {
        console.error('遍历目录时出错:', error);
    }
})();
