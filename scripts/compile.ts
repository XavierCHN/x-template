// 使用 ES 模块导入
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import getDotaPath from './getDotaPath';
import readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import config from './addon.config';

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
    const addon_name = config.addon_name;

    const addonContent = path.join(dotaPath, 'content', 'dota_addons', addon_name);

    const gamePath = path.join(dotaPath, 'game', 'dota');

    // use readline to get the compile target dirs
    const rl = readline.createInterface({ input, output });
    rl.question(
        `请输入你要编译的文件或文件夹名称，多个文件夹用空格分隔：\n示例：文件夹输入：panorama/layout\n单一文件输入 maps/temp.vmap\n`,
        (answer: string) => {
            const subdirs = answer.split(' ');

            const args: string[] = [];
            args.push(`"${resourceCompilerPath}"`);
            args.push(`-game "${gamePath}"`);
            args.push(`-verbose`);
            args.push(`-pauseiferror`);
            args.push(`-r`);

            if (subdirs.length <= 0) {
                console.log('没有输入文件夹名称，将编译game目录下的所有文件夹');
                subdirs.push(...fs.readdirSync(addonContent));
            }

            console.log(`开始编译${subdirs.length}个文件夹...`);

            subdirs.forEach((dir: string) => {
                console.log(`编译${dir}...`);

                // 判断文件夹是否存在
                const targetPath = path.join(addonContent, dir);
                if (!fs.existsSync(targetPath)) {
                    console.log(`文件(夹) ${targetPath}不存在，跳过...`);
                    return;
                }

                const c = args.concat([
                    `-i "${path.join(
                        addonContent,
                        dir,
                        // 如果是文件夹，自动加上 * 通配符
                        fs.statSync(targetPath).isDirectory() ? '*' : ''
                    )}"`,
                ]);
                const command = c.join(` `);
                console.log(`开始执行指令：${command}`);

                try {
                    execSync(command, {
                        maxBuffer: 1024 * 1024 * 100, // 给大一点
                        // output console output in the command window
                        stdio: 'inherit',
                    });
                } catch (error) {
                    console.error('执行命令时出错:', error);
                }
            });
            rl.close();
        }
    );
})().catch((error: Error) => {
    console.error(error);
    process.exit(1);
});
