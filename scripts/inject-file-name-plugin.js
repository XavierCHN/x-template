/**
 * TSTL 插件：在每个编译后的 Lua 文件顶部注入文件名注册代码
 * 用途：替代运行时 debug.getinfo 获取文件路径的方案
 * 
 * 使用方式：在 tsconfig.json 的 tstl.luaPlugins 中添加此插件
 * {
 *   "tstl": {
 *     "luaPlugins": [{ "name": "./scripts/inject-file-name-plugin.js" }]
 *   }
 * }
 */

/**
 * @param {import("typescript-to-lua").Program} program
 * @param {import("typescript-to-lua").CompilerOptions} options
 * @param {import("typescript-to-lua").EmitHost} emitHost
 * @param {import("typescript-to-lua").EmitResult} result
 */
function afterPrint(program, options, emitHost, result) {
    for (const file of result) {
        const sourceFile = file.fileName;
        // Normalize path separators to forward slashes
        const normalized = sourceFile.replace(/\\/g, '/');
        
        // Extract relative path from src directory
        const srcIndex = normalized.indexOf('/src/');
        let relativePath;
        if (srcIndex !== -1) {
            relativePath = normalized.substring(srcIndex + 1); // +1 to keep the 'src/' prefix
        } else {
            // Fallback: just use the filename
            const parts = normalized.split('/');
            relativePath = parts[parts.length - 1];
        }
        
        // 将 .ts 扩展名替换为 .lua（引擎认的是 lua 文件）
        relativePath = relativePath.replace(/\.ts$/, '.lua');
        
        // Inject code at the top of the file:
        // 1. Declare ____fileName as a local variable
        // 2. Initialize __TS__fileRegistry if it doesn't exist
        // 3. Register the current environment with the file name
        const injection = `local ____fileName = "${relativePath}"
if not __TS__fileRegistry then __TS__fileRegistry = {} end
__TS__fileRegistry[tostring(getfenv(1))] = ____fileName
`;
        file.code = injection + file.code;
    }
}

/** @type {import("typescript-to-lua").Plugin} */
const plugin = {
    afterPrint,
};

module.exports = plugin;
