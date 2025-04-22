// 使用 ES 模块导入
import { spawn } from 'child_process';
import path from 'path';
import getDotaPath from './getDotaPath';
import config from './addon.config';

// 定义 launchDota2 函数参数类型
export default async function launchDota2(addon_name?: string, map_name?: string): Promise<void> {
    const dotaPath = await getDotaPath();

    if (dotaPath === undefined) {
        console.log(`no DOTA2 installation found, addon launch is skipped`);
        return;
    }

    const win64Path = path.join(dotaPath, 'game', 'bin', 'win64');

    let args: string[] = ['-novid', '-tools'];

    if (['do', 'dota2', 'dop', 'doc'].includes(map_name || '')) {
        console.log(`let's play some dota! ${map_name === 'dop' ? '-perfectworld' : map_name === 'doc' ? '-steamchina' : ''}`);
        const playArgs: string[] = ['-novid'].concat(map_name === 'dop' ? ['-perfectworld'] : map_name === 'doc' ? ['-steamchina'] : []);
        spawn(path.join(win64Path, 'dota2.exe'), playArgs, { detached: true, cwd: win64Path });
    } else {
        if (addon_name === undefined) {
            addon_name = config.addon_name;
        }

        args = args.concat(['-addon', addon_name]);

        if (map_name) {
            args.push(`+dota_launch_custom_game ${addon_name} ${map_name}`);
            console.log(`begin to load addon=>${addon_name}, map name=>${map_name}`);
        }

        spawn(path.join(win64Path, 'dota2.exe'), args, { detached: true, cwd: win64Path });
        spawn(path.join(win64Path, 'vconsole2.exe'));
    }
}
