const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');
const { getDotaPath } = require('./utils');

(async () => {
    const addon_name = require('./addon.config.js').addon_name; // 直接从addon.config.js中读取项目名称

    if (process.platform !== 'win32') {
        console.log('This script runs on windows only, Addon Linking is skipped.');
        return;
    }

    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log('No Dota 2 installation found. Addon linking is skipped.');
        return;
    }

    for (const directoryName of ['game', 'content']) {
        const sourcePath = path.resolve(__dirname, '..', directoryName);
        assert(fs.existsSync(sourcePath), `Could not find '${sourcePath}'`);

        const targetRoot = path.join(dotaPath, directoryName, 'dota_addons');
        assert(fs.existsSync(targetRoot), `Could not find '${targetRoot}'`);

        const targetPath = path.join(dotaPath, directoryName, 'dota_addons', addon_name);
        if (fs.existsSync(targetPath)) {
            const isCorrect = fs.lstatSync(sourcePath).isSymbolicLink() && fs.realpathSync(sourcePath) === targetPath;
            if (isCorrect) {
                console.log(`Skipping '${sourcePath}' since it is already linked`);
                continue;
            } else {
                // 移除目标文件夹的所有内容，
                console.log(`'${targetPath}' is already linked to another directory, removing`);
                fs.chmodSync(targetPath, '0755');
                rimraf(targetPath, () => {
                    console.log('removed target path');
                    fs.moveSync(sourcePath, targetPath);
                    fs.symlinkSync(targetPath, sourcePath, 'junction');
                    console.log(`Repaired broken link ${sourcePath} <==> ${targetPath}`);
                });
            }
        } else {
            fs.moveSync(sourcePath, targetPath);
            fs.symlinkSync(targetPath, sourcePath, 'junction');
            console.log(`Linked ${sourcePath} <==> ${targetPath}`);
        }
    }

    // 为什么一定要用这样的顺序写，是因为Valve不支持在addon中使用符号链接
    // 所以我们符号链接的源必须是在dota 2 beta/game/scripts/src/shared
    // 所以shared linking必须在最后写
    const sharedSource = path.join(dotaPath, 'game', 'dota_addons', addon_name, 'scripts', 'src', 'shared');
    const sharedTargetPath = path.resolve(__dirname, '..', 'content', 'panorama', 'src', 'shared');
    if (fs.existsSync(sharedSource)) {
        if (fs.existsSync(sharedTargetPath)) {
            const isCorrect = fs.lstatSync(sharedTargetPath).isSymbolicLink() && fs.realpathSync(sharedTargetPath) === sharedSource;
            if (isCorrect) {
                console.log(`Skipping '${sharedSource}' since it is already linked`);
            } else {
                fs.removeSync(sharedTargetPath);
                fs.symlinkSync(sharedSource, sharedTargetPath, 'junction');
                console.log(`Repaired broken link ${sharedSource} <==> ${sharedTargetPath}`);
            }
        } else {
            fs.symlinkSync(sharedSource, sharedTargetPath, 'junction');
            console.log(`Linked ${sharedSource} <==> ${sharedTargetPath}`);
        }
    } else {
        console.log(`Could not find '${sharedSource}', shared script linking is skipped`);
    }
})().catch(error => {
    console.error(error);
    process.exit(1);
});
