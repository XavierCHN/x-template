const path = require('path');
const { getDotaPath } = require('./utils');
const { launchDota2 } = require('./launchDota2');

(async () => {
    let addon_name;
    let map_name;

    const script = process.env.npm_lifecycle_script ?? process.env.npm_package_scripts_launch;
    const params = script.match(/"(?:\\?[\S\s])*?"/g);
    if (params != null && params.length > 0) {
        if (params.length == 1) {
            map_name = params[0].replace(/"/g, '');
        } else {
            addon_name = params[0].replace(/"/g, '');
            map_name = params[1].replace(/"/g, '');
        }
    }

    if (process.env.npm_config_argv != null) {
        const argv = JSON.parse(process.env.npm_config_argv);
        if (argv.original != null && argv.original.length > 0) {
            let args = argv.original.slice(1);
            if (args[0] == `launch`) {
                // 如果有手动输入run的情况
                args = args.slice(1);
            }
            if (args.length > 0) {
                if (args.length == 1) {
                    map_name = args[0];
                }
                if (args.length >= 2) {
                    addon_name = args[0];
                    map_name = args[1];
                }
            }
        }
    } else console.log('Usage `yarn launch [[addon name] map name]`');

    launchDota2(addon_name, map_name);
})().catch(error => {
    console.error(error);
    process.exit(1);
});
