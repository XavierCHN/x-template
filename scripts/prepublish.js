const rimraf = require('rimraf');
const fs = require('fs-extra');
const path = require('path');

const { getDotaPath, getAddonName } = require('./utils');
(async () => {
    const publishSource = path.resolve(__dirname, '..', 'publish');
    const dotaPath = await getDotaPath();
    const publishTargetDirectory = path.join(dotaPath, 'game', 'dota_addons', getAddonName() + '_publish');

    if (fs.existsSync(publishSource)) rimraf.sync(publishSource);
    if (fs.existsSync(publishTargetDirectory)) rimraf.sync(publishTargetDirectory);

    console.log('removed the publish directory, remaking to clean it');

    fs.mkdirSync(publishTargetDirectory);
    fs.symlinkSync(publishTargetDirectory, publishSource, 'junction');
    console.log('pre publlish done, new publish directory is created!');
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
