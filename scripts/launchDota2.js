const { spawn } = require('child_process');
const path = require('path');
const { getDotaPath } = require('./utils');

async function launchDota2(addon_name, map_name) {
    const dotaPath = await getDotaPath();

    if (dotaPath === undefined) {
        console.log(`no DOTA2 installation found, addon launch is skipped`);
        return;
    }

    const win64Path = path.join(dotaPath, 'game', 'bin', 'win64');

    let args = ['-novid', '-tools'];

    if ([`do`, `dota2`, `dop`, `doc`].includes(map_name)) {
        console.log(`let's play some dota! ${map_name == `dop` ? `-perfectworld` : map_name == `doc` ? `-steamchina` : ``}`);
        const args = [`-novid`].concat(map_name == `dop` ? [`-perfectworld`] : map_name == `doc` ? [`-steamchina`] : []);
        spawn(path.join(win64Path, 'dota2.exe'), args, { detached: true, cwd: win64Path });
    } else {
        if (addon_name == undefined) addon_name = require('./addon.config.js').addon_name;

        args = args.concat(['-addon', addon_name]);

        if (map_name) {
            args.push(`+dota_launch_custom_game ${addon_name} ${map_name}`);
            console.log(`begin to load addon=>${addon_name}, map name=>${map_name}`);
        }

        spawn(path.join(win64Path, 'dota2.exe'), args, { detached: true, cwd: win64Path });
        spawn(path.join(win64Path, 'vconsole2.exe'));
    }
}
module.exports.launchDota2 = launchDota2;
