const { spawn } = require('child_process');
const path = require('path');
const { getAddonName, getDotaPath } = require('./utils');

(async () => {
    const dotaPath = await getDotaPath();
    const win64 = path.join(dotaPath, 'game', 'bin', 'win64');

    // You can add any arguments there
    // For example `+dota_launch_custom_game ${getAddonName()} dota` would automatically load "dota" map
    let addon_name = getAddonName();
    let map_name;
    let argv = JSON.parse(process.env.npm_config_argv.replace("'", '')).original;
    for (let i in argv) {
        let mm = argv[i];
        let cm = argv[Number(i) + 1];
        if (mm == '--m') map_name = cm;
        if (mm == '--a') addon_name = cm;
    }
    console.log('begin to load addon=>', addon_name);
    if (addon_name == getAddonName() && map_name == null) console.log('you can use launch options\n--m map_name \n--a addon');
    const args = ['-novid', '-tools', '-addon', addon_name];
    if (map_name) args.push(`+dota_launch_custom_game ${addon_name} ${map_name}`);
    spawn(path.join(win64, 'dota2.exe'), args, { detached: true, cwd: win64 });
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
