import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';
import getDotaPath from './getDotaPath';
import config from './addon.config';

(async () => {
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

        const targetPath = path.join(dotaPath, directoryName, 'dota_addons', config.addon_name);
        if (fs.existsSync(targetPath)) {
            const isCorrect = fs.lstatSync(sourcePath).isSymbolicLink() && fs.realpathSync(sourcePath) === targetPath;
            if (isCorrect) {
                console.log(`Skipping '${sourcePath}' since it is already linked`);
                continue;
            } else {
                console.log(`'${targetPath}' is already linked to another directory, repairing...`);

                const backupPath = `${sourcePath}.backup.${Date.now()}`;
                let backupCreated = false;

                try {
                    fs.chmodSync(targetPath, '0755');

                    fs.moveSync(sourcePath, backupPath);
                    backupCreated = true;
                    console.log(`Created backup at '${backupPath}'`);

                    await fs.remove(targetPath);
                    console.log('Removed old target path');

                    fs.moveSync(backupPath, targetPath);
                    console.log('Moved backup to target path');

                    fs.symlinkSync(targetPath, sourcePath, 'junction');
                    console.log(`Repaired broken link ${sourcePath} <==> ${targetPath}`);
                } catch (error) {
                    console.error('Failed to repair link:', error);

                    if (backupCreated && fs.existsSync(backupPath)) {
                        try {
                            if (!fs.existsSync(sourcePath)) {
                                fs.moveSync(backupPath, sourcePath);
                                console.log(`Restored '${sourcePath}' from backup`);
                            } else {
                                await fs.remove(backupPath);
                                console.log(`Cleaned up backup at '${backupPath}'`);
                            }
                        } catch (restoreError) {
                            console.error(`CRITICAL: Failed to restore backup from '${backupPath}':`, restoreError);
                            console.error(`Please manually restore your data from '${backupPath}' to '${sourcePath}'`);
                        }
                    }

                    throw error;
                }
            }
        } else {
            fs.moveSync(sourcePath, targetPath);
            fs.symlinkSync(targetPath, sourcePath, 'junction');
            console.log(`Linked ${sourcePath} <==> ${targetPath}`);
        }
    }

    // const sharedSource = path.join(dotaPath, 'game', 'dota_addons', config.addon_name, 'scripts', 'src', 'shared');
    // const sharedTargetPath = path.resolve(__dirname, '..', 'content', 'panorama', 'src', 'shared');
    // if (fs.existsSync(sharedSource)) {
    //     if (fs.existsSync(sharedTargetPath)) {
    //         const isCorrect = fs.lstatSync(sharedTargetPath).isSymbolicLink() && fs.realpathSync(sharedTargetPath) === sharedSource;
    //         if (isCorrect) {
    //             console.log(`Skipping '${sharedSource}' since it is already linked`);
    //         } else {
    //             fs.removeSync(sharedTargetPath);
    //             fs.symlinkSync(sharedSource, sharedTargetPath, 'junction');
    //             console.log(`Repaired broken link ${sharedSource} <==> ${sharedTargetPath}`);
    //         }
    //     } else {
    //         fs.symlinkSync(sharedSource, sharedTargetPath, 'junction');
    //         console.log(`Linked ${sharedSource} <==> ${sharedTargetPath}`);
    //     }
    // } else {
    //     console.log(`Could not find '${sharedSource}', shared script linking is skipped`);
    // }
})().catch((error: Error) => {
    console.error(error);
    process.exit(1);
});
