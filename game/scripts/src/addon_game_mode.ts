require('utils/aeslua');
require('utils/decrypt');

require('lib/timers');

// some helper lua modules, if it is not used, please comment it out
// 一些辅助的lua模块，如果没有使用到的可以注释掉
require('utils/json');
require('utils/md5');
require('utils/popups');
require('utils/sha');

//@ts-ignore
let GameMode = require('game_mode').GameMode

Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.Addon) {
    GameRules.Addon.Reload();
}