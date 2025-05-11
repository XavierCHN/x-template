import fs from 'fs-extra';
import path from 'path';

/**
 * 项目名称
 * 必须为字母开头，而且只能包含小写字母、数字和下划线
 */
let addon_name: string = 'x_template';

/**
 * 要加密的项目列表
 * 建议需要双端运行的modifier, ability代码等不加密
 * 避免出现运行时错误或者泄漏加密秘钥
 * 当然你也可以选择修改这部分加密代码，做到服务器端使用真正的密码加密，客户端相关的代码用“伪密码”加密
 * 然后悄悄地把解密代码放在某个神奇的地方，但是这里作为模板项目就不演示了，大家就自行研究吧！
 * 还是建议把核心代码保护住就好，技能代码之类的放出来供提升社区水平也是不错的
 */
const encrypt_files: string[] = [
    // 加密所有lua文件
    '**/*.lua',
    // 不加密这几个必须不加密的
    '!game/scripts/vscripts/lualib_bundle.lua',
    '!game/scripts/vscripts/addon_init.lua',
    '!game/scripts/vscripts/addon_game_mode.lua',
    '!game/scripts/vscripts/addon_game_mode_client.lua',

    // 不加密解密所需代码
    '!game/scripts/vscripts/utils/**/*.lua',

    // 范例代码（包含技能和modifier）需要双端运行，这里也不加密
    '!game/scripts/vscripts/examples/**/*.lua',
];

/** 发布时要排除的文件列表，他们不会被复制到发布的game文件夹 */
const exclude_files: string[] = [
    'game/scripts/src/**/*.*', // 不输出源码
    '**/*.json',
    '**/*.ts',
    '**/*.bin',
    '**/*.py',
    '**/*.cfg',
];

/** 本地测试（工具模式）密钥，一般不需要修改 */
const encryptDedicatedServerKeyTest: string = `Invalid_NotOnDedicatedServer`;

/** 测试发布（测试图）密钥，运行 yarn prod 必须，获取方法请查看 Debug.ts 中的 get_key_v3 指令 */
const encryptDedicatedServerKeyRelease_Test: string = `这里需要填入测试图的密钥 GetDedicatedServerKeyV3('version') 的结果`;

/** 正式发布（正式图）密钥，运行 yarn prod 必须，获取方法请查看 Debug.ts 中的 get_key_v3 指令 */
const encryptDedicatedServerKeyRelease: string = `这里需要填入正式的发布密钥 GetDedicatedServerKeyV3('version') 的结果`;

/** 验证配置是否合法 */
function validateAddonName() {
    if (!addon_name.match(/^[a-z][a-z0-9_]*$/)) {
        throw new Error(
            'addon_name 必须为字母开头，而且只能包含小写字母、数字和下划线，请到 addon.config.ts 修改\nplease change addon_name in c to match /^[a-z][a-z0-9_]*$/'
        );
    }
    if (addon_name === 'x_template') {
        throw new Error(
            '请到 scripts/addon.config.ts 修改 addon_name 为你的项目名称，不能为 x_template\nplease change addon_name in addon.config.ts to your project name, not x_template'
        );
    }
}

/**
 * 这里只是为了我自己开发模板的时候方便，我会在我本地的
 * .test/addon_name.txt 中写一个 test
 * 这样我不用把上面的 addon_name 改成 test 了
 * 你可以忽略下面这段代码
 *
 */

function importAddonName() {
    const filePath = path.join(__dirname, '.test', 'addon_name.txt'); // 假设文件是 .js 扩展名
    try {
        // 同步读取文件内容
        const fileContent = fs.readFileSync(filePath, 'utf8');
        addon_name = fileContent;
        console.log(`使用开发模板时配置的项目名称：${addon_name}`);
    } catch (e) {}
}

// 同步调用导入函数
importAddonName();
try {
    validateAddonName();
} catch (error) {
    console.error(error);
    // 可以根据实际情况处理错误，比如退出进程等
}

// 导出配置对象
export default {
    addon_name,
    encrypt_files,
    exclude_files,
    encryptDedicatedServerKeyTest,
    encryptDedicatedServerKeyRelease_Test,
    encryptDedicatedServerKeyRelease,
};
