// 使用 ES 模块导入
import launchDota2 from './launchDota2';

(async () => {
    let addon_name: string | undefined;
    let map_name: string | undefined;

    const script: string | undefined = process.env.npm_lifecycle_script ?? process.env.npm_package_scripts_launch;
    let params: RegExpMatchArray | null = null;
    if (script) {
        params = script.match(/"(?:\\?[\S\s])*?"/g);
    }

    if (params != null && params.length > 0) {
        if (params.length === 1) {
            map_name = params[0].replace(/"/g, '');
        } else {
            addon_name = params[0].replace(/"/g, '');
            map_name = params[1].replace(/"/g, '');
        }
    }

    if (process.env.npm_config_argv != null) {
        try {
            const argv: { original?: string[] } = JSON.parse(process.env.npm_config_argv);
            if (argv.original != null && argv.original.length > 0) {
                let args: string[] = argv.original.slice(1);
                if (args[0] === `launch`) {
                    // 如果有手动输入run的情况
                    args = args.slice(1);
                }
                if (args.length > 0) {
                    if (args.length === 1) {
                        map_name = args[0];
                    }
                    if (args.length >= 2) {
                        addon_name = args[0];
                        map_name = args[1];
                    }
                }
            }
        } catch (parseError) {
            console.error('解析 npm_config_argv 时出错:', parseError);
        }
    } else {
        console.log('Usage `yarn launch [[addon name] map name]`');
    }

    launchDota2(addon_name, map_name);
})().catch((error: Error) => {
    console.error(error);
    process.exit(1);
});
