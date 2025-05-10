// 引入所有的lua模块
require('aeslua');
require('decrypt');
require('json');
require('md5');
require('popups');
if (IsServer()) {
    require('timers');
}

// rename SHA and make it global
globalThis.SHA = require('sha');
globalThis.LibDeflate = require('libs/deflate');
globalThis.base64 = require('libs/base64');
