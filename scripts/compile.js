const assert = require('assert');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');
const { getDotaPath } = require('./utils');

(async () => {
    if (process.platform !== 'win32') {
        console.log('Resource compiler runs on windows only, exiting...');
        return;
    }

    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log('No Dota 2 installation found, exiting...');
        return;
    }

    // get the resourcecompiler.exe path
    const resourceCompilerPath = path.join(dotaPath, 'game', 'bin', 'win64', 'resourcecompiler.exe');
    const addon_name = require('./addon.config.js').addon_name; // 直接从addon.config.js中读取项目名称

    const addonContent = path.join(dotaPath, 'content', 'dota_addons', addon_name);

    const gamePath = path.join(dotaPath, 'game', 'dota');

    let script = process.env.npm_lifecycle_script ?? process.env.npm_package_scripts_launch;
    let params = script.match(/"(?:\\?[\S\s])*?"/g);
    subDirs = ['materials', 'particles', 'soundevents', 'vscripts', 'scripts', 'maps']; // default compile targets
    if (params !== null) {
        subDirs = params.map(p => p.replace(/"/g, ''));
    }

    let args = [];
    args.push(`"${resourceCompilerPath}"`);
    args.push(`-game "${gamePath}"`);
    args.push(`-verbose`);
    args.push(`-r`);
    subDirs.forEach(dir => {
        let c = args.concat([`-i "${path.join(addonContent, dir, '*')}"`]);
        exec(c.join(` `), (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (stdout) console.log(stdout);
        });
    });
})().catch(error => {
    console.error(error);
    process.exit(1);
});
