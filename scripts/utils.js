const packageJson = require('../package.json');
const fs = require('fs-extra');
const { getGamePath } = require('steam-game-path');

module.exports.getDotaPath = async () => {
    const path = getGamePath(570);
    return path.game.path;
};
