import fs from 'fs-extra';
import path from 'path';
import getDotaPath from './getDotaPath';
import config from './addon.config';

(async () => {
    const publishSource = path.resolve(__dirname, '..', 'publish');
    const dotaPath = await getDotaPath();
    const addon_name = config.addon_name;
    const publishTargetDirectory = path.join(dotaPath, 'game', 'dota_addons', addon_name + '_publish');

    if (fs.existsSync(publishSource)) {
        await fs.remove(publishSource);
    }
    if (fs.existsSync(publishTargetDirectory)) {
        await fs.remove(publishTargetDirectory);
    }

    console.log('removed the publish directory, remaking to clean it');

    fs.mkdirSync(publishTargetDirectory);
    fs.symlinkSync(publishTargetDirectory, publishSource, 'junction');
    console.log('pre publish done, new publish directory is created!');
})().catch((error: Error) => {
    console.error(error);
    process.exit(1);
});
