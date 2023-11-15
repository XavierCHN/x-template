/** 项目名称 */
let addon_name = 'x_template'; // 必须为字母开头，而且只能包含小写字母、数字和下划线

try {
    addon_name = require('./.test/addon_name');
} catch (e) {
    //do nothing
}

/** 要加密的项目列表 */
const encrypt_files = [
    '**/*.lua',
    '!game/scripts/vscripts/lualib_bundle.lua',
    '!game/scripts/vscripts/addon_init.lua',
    '!game/scripts/vscripts/addon_game_mode.lua',
    '!game/scripts/vscripts/addon_game_mode_client.lua',
    '!game/scripts/vscripts/utils/index.lua',
    '!game/scripts/vscripts/utils/decrypt.lua',
    '!game/scripts/vscripts/utils/aeslua.lua',
    '!game/scripts/vscripts/utils/aeslua/**/*.lua',
];

/** 发布时要排除的文件列表 */
const exclude_files = [
    'game/scripts/src/**/*.*', // 不输出源码
    '**/*.json',
    '**/*.ts',
    '**/*.bin',
    '**/*.py',
    '**/*.cfg',
];

/** 本地测试（工具模式）密钥，一般不需要修改 */
const encryptDedicatedServerKeyTest = `Invalid_NotOnDedicatedServer`;

/** 测试发布（测试图）密钥，运行 yarn prod 必须，获取方法请参考 https://github.com/XavierCHN/fetch-keys */
const encryptDedicatedServerKeyRelease_Test = `这里需要填入测试图的密钥 GetDedicatedServerKeyV3('version') 的结果`;

/** 正式发布（正式图）密钥，运行 yarn prod 必须，获取方法请参考 https://github.com/XavierCHN/fetch-keys */
const encryptDedicatedServerKeyRelease = `这里需要填入正式的发布密钥 GetDedicatedServerKeyV3('version') 的结果`;

/** 验证配置是否合法 */
const assert = require('assert');
assert(
    addon_name.match(/^[a-z][a-z0-9_]*$/),
    'addon_name 必须为字母开头，而且只能包含小写字母、数字和下划线，请到 addon.config.js 修改\nplease change addon_name in addon.config.js to match /^[a-z][a-z0-9_]*$/'
);
assert(
    addon_name !== 'x_template',
    '请到 scripts/addon.config.js 修改 addon_name 为你的项目名称，不能为 x_template\nplease change addon_name in addon.config.js to your project name, not x_template'
);

module.exports = {
    addon_name: addon_name,
    encrypt_files: encrypt_files,
    exclude_files: exclude_files,
    encryptDedicatedServerKeyTest: encryptDedicatedServerKeyTest,
    encryptDedicatedServerKeyRelease_Test: encryptDedicatedServerKeyRelease_Test,
    encryptDedicatedServerKeyRelease: encryptDedicatedServerKeyRelease,
};
