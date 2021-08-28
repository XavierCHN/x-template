const { spawn } = require("child_process");
const path = require("path");
const { getAddonName, getDotaPath } = require("./utils");

(async () => {
    const dotaPath = await getDotaPath();
    const win64 = path.join(dotaPath, "game", "bin", "win64");

    // You can add any arguments there
    // For example `+dota_launch_custom_game ${getAddonName()} dota` would automatically load "dota" map
    let addon_name = getAddonName();
    let map_name;

    let script = process.env.npm_lifecycle_script ?? process.env.npm_package_scripts_launch;
    let params = script.match(/"(?:\\?[\S\s])*?"/g);
    if (params != null && params.length > 0) {
        if (params.length == 1) {
            map_name = params[0].replace(/"/g, "");
        } else {
            addon_name = params[0].replace(/"/g, "");
            map_name = params[1].replace(/"/g, "");
        }
    }

    if (map_name != null) console.log(`begin to load addon=>${addon_name}, map name=>${map_name}`);
    else console.log("you can use launch with `npm run launch [[addon_name] map_name]");

    const args = ["-novid", "-tools", "-addon", addon_name];
    if (map_name) args.push(`+dota_launch_custom_game ${addon_name} ${map_name}`);
    
    spawn(path.join(win64, "dota2.exe"), args, { detached: true, cwd: win64 });
    spawn(path.join(win64, "vconsole2.exe"));
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
