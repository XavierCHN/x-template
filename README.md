

#### [Russian lang](https://github.com/XavierCHN/x-template/blob/master/readme_rus.md)
#### <a href="#x-template">中文说明</a>
#### <a href="#x-template-1">English Readme</a>

### [简单的视频教程（中文） a starter video tutorial (Chinese)](https://www.bilibili.com/video/BV1de4y1s7kw/?vd_source=9bc3eaf21f82a00973f08ff2dbcfd356)

视频录制的比较早，目前已经转换为`yarn`作为npm包管理工具，请自行将视频中的`npm`改为`yarn`

# X-Template

Xavier 的 dota2 自定义游戏开发模板

### 使用步骤

#### 新建项目

1. [点击使用本项目作为模板生成你自己的项目](https://github.com/XavierCHN/x-template/generate)或者 [fork 本项目](https://github.com/XavierCHN/x-template/fork)
2. 安装`node.js`，目前的要求是`>16.0.0`
3. clone 你使用模板生成的或者 fork 的项目
4. 安装好vscode之后和下方[DOTA2 Modding 工具推荐](https://github.com/XavierCHN/x-template#dota2-modding-%E5%B7%A5%E5%85%B7%E6%8E%A8%E8%8D%90) 相关软件后，使用vscode打开clone的文件夹
5. 打开`scripts/addon.config.js`，将`addon_name`修改为你的项目名称
6. 执行`yarn install`安装依赖，他应该会自动 link`content`,`game`文件夹到你的`dota 2 beta/dota_addons` (如果碰到权限问题，请关闭代码编辑器后使用控制台来执行`yarn`，或者重启一下电脑再试，如果碰到安装错误，可以尝试使用[npmmirror镜像](https://npmmirror.com/)，或者直接执行`yarn config set registry https://registry.npmmirror.com`再执行`yarn install`)
7. `yarn dev`，开始你的开发
8. 如果你要启动你的项目，你可以使用指令`yarn launch map_name`启动游戏并载入地图，或者使用`yarn launch`只是启动工具而不载入地图，之后再在控制台使用指令载入地图。

#### 从已有的项目迁移

流程同新建项目，只不过在5后插入一个

6. 将原有项目的content和game文件夹覆盖到本项目中的 content 和 game 文件夹

* 当然，你需要处理好原有的内容的 `.gitignore`，因为本项目默认不追踪 `content/panorama/layout/` 目录 和 `game/scripts/vscripts/` 目录的变更
    * 如果后端要混合使用lua和ts，请将lua代码复制到src文件夹，为了可以有代码提示，你需要自己写一个 `*.d.ts` 文件来提供类型声明，如果要使用 `import` 语句，请对lua脚本进行适当的修改，可以参考对 `game/scripts/src/utils/timers.lua`的改造及他对应的 `d.ts` 文件
    * 如果前端要混合使用xml和react，请对应修改 `webpack.dev.js`，主要是要删去 `PanoramaManifestPlugin` 部分，来自己编辑 `custom_ui_manifest.xml`，更推荐的做法是将 传统 panorama 写法的代码放到 src 文件夹，之后使用 webpack 共同打包

### 使用这个模板的好处

1. 可以使用更为`现代`的语言来进行开发，也就是`typescript`，而不是用`lua`和`javascript`，等于可以少学一门语言。
2. 使用表格工具来填写并管理你的`kv`文件，而无需掌握他们的结构。
3. 使用`react`来开发UI可以更好地管理你的代码，而无需掌握`xml`的写法。
4. 帮助解决了V社的工具中诸如`UI无法读取KV文件`，`UI图片不会自动编译`等问题。
5. 加密发布代码的支持，可以帮助你保护一些关键代码。

### 支持的功能


1. 前端的`content/panorama/src`与后端的`game/scripts/src`文件夹分别用来写用户界面 react 源码和游戏逻辑的 ts 源代码
2. 将你的 excel 文件变成 kv 文件并放到`game/scripts/npc`文件夹，同时在panorama和scripts文件夹生成与每个kv文件对应的json文件，这样你的ts代码可以很方便地获取kv数据
3. 将 `addon.csv` 变成 `addon_*.txt`，(也可以把 `addon_*.txt` 变成 `addon.csv`)
4. 将服务器API转换为typescript接口，同时提供了一个有效的请求类用来处理请求，使用的是 [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)

### 支持的指令

1. `yarn launch [[addon_name] map_name]` 启动 dota2，两个参数为可选参数，如果提供了`addon_name`那么会载入指定的 addon（默认该项目），提供了`map_name`则会自动载入对应的地图名（若未提供 addon_name 则默认载入当前 addon）
2. `yarn dev` 进入 dev 模式，将会执行`将后端的ts代码编译成lua代码、使用webpack打包前端代码、同步KV到js，生成localization，Excel转KV等操作`，正常来说，每次开发你需要保持yarn dev的运行状态
3. `yarn prod` 执行`发布`操作，将会自动生成`publish`文件夹并自动 link 到`dota_addons/you_addon_name_publish`文件夹，之后你可以选择这个文件夹发布（可以在`package.json -> dota_developer`中对发布进行一些设置）。
##### PS. 加密发布流程

将 scripts/addon.config.js 里面的 `encrypt_files` 变量根据你的需要修改，哪些文件加密，哪些不加密（解密脚本，入口文件不能加密，客户端会使用到的技能和Modifier代码建议也不加密，不要尝试通过将密钥发送给客户端这样的操作来加密客户端脚本，因为别人可以通过读内存等等方法获取到密钥）

将该文件中的 `encryptDedicatedServerKeyRelease` 修改成你的图的 DedicatedServerKey

key的获取方法：不加密上传一次，去获取KEY,要注意，获取KEY的 `version` 参数应该和 decrypt.lua 中的保持一致，你也可以上传[这个项目](https://github.com/XavierCHN/fetch-keys)去批量获取一些key，之后根据需要使用某一个key

执行`yarn prod` 来完成测试加密流程（在加密范围内的代码有变更之后需要执行，一般是要确认新加的功能能否在加密后正常运行）

确认一切运行正确后，执行 `yarn prod` 来完成正式发布加密流程

执行`yarn launch your_addon_name_publish`来启动加密后的图，之后执行上传操作（注意，这个时候本地的publish是不能正常运行的，因为密钥只有服务器上有，因此直接上传即可）

* 注意：要使用加密功能，需要安装 [Lua 命令行程序](http://luabinaries.sourceforge.net/)（如果未安装会提示未找到lua命令）


4. `yarn api` 生成与 `scripts/server_api.json` （需要符合**Swagger 3.0规范**）的API一致的请求类，并储存于 `game/scripts/src/server/services`，关于请求实现的细节，请查阅 `game/scripts/src/server/core` 文件夹

### 文件夹内容

-   content 会和 `dota 2 beta/content/dota_addons/your_addon_name` 同步更新
-   game 会和 `dota 2 beta/game/dota_addons/your_addon_name` 同步更新
-   shared 用来写`panorama ts`和`tstl`公用的声明，如`custom_net_tables`等
-   scripts 各种 node 脚本，用来完成各种辅助功能
-   请仔细查阅 `gulpfile.ts` 来查看 gulp 的使用方法


### DOTA2 Modding 工具推荐

> [node.js](https://nodejs.org/en/), [LuaForWindows](http://luabinaries.sourceforge.net/) , [Python](https://www.python.org/) 等一系列环境的配置请自行使用搜索引擎完成，不赘述。

> 只推荐使用`steam`启动dota2的形式来完成modding，如果尚未安装，请[点此下载](https://store.steampowered.com/about/)

##### 需要安装的软件包括：
1. 代码编辑器 [Visual Studio Code](https://code.visualstudio.com) 或者其他你习惯使用的typescript代码编辑器
2. 反编译工具 [ValveResourceFormat](https://github.com/SteamDatabase/ValveResourceFormat/releases)（推荐）或者 [GCFScape](https://nemstools.github.io/pages/GCFScape-Download.html)(已略过时，某些格式反编译不了，但是速度比较快，推荐都安装)
3. Adobe系列工具, 如PhotoShop（必须）, Audition（选装）等，请到 [官网](https://www.adobe.com/) 下载或自行使用搜索引擎获取
4. 代码版本控制 [Github Desktop](https://desktop.github.com/)（推荐，和github的配合比较好） 或 [SourceTree](https://www.sourcetreeapp.com/) 或 [TortoiseSVN](https://tortoisesvn.net/index.zh.html)
5. 模型编辑器Blender Steam直接安装【steam://install/365670】 [Steam商店页面](https://store.steampowered.com/app/365670/Blender/) （用自己顺手的就行，如果不涉及模型编辑可略过）
6. 其他实用工具： [文件搜索工具Everything](https://www.voidtools.com/zh-cn/) [Deepl翻译](https://www.deepl.com/translator) [Node版本控制nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

### 其他
如果你在DOTA2自定义游戏制作过程中遇到了任何问题，可以到本项目的 [Issues页面](https://github.com/XavierCHN/x-template/issues) 提问，如果我知道的将会予以解答。

# X-Template

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) [![Version](https://img.shields.io/github/release/XavierCHN/x-template.svg)]() Xavier's dota2 custom game development template (English translated with [DeepL](https://www.deepl.com))

### Pre-requisites

If you want to use this template, in addition to mastering the Valve's development tools, you need to additionally learn

1. the syntax of `typescript`, `javascript`
2. the basics of `react`
3. the basics of `node.js`
4. learn about [react-panorama](https://github.com/ark120202/react-panorama)
5. learn about [TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua)
6. learn about the `DOTA2 Typescript API`, you can check out `node_modules/dota-lua-types` and `node_modules/panorama-types` after you finish `yarn`.

### Supported features

1. convert the xlsx, xls kv files into a kv file and put it in the `game/scripts/npc`,
2. convert `addon.csv` to `addon_*.txt`, (also you can convert them back to `addon.csv`),
3. convert kv files to json files for you to fetch kv data in panorama UI,
4. use typescript to write game logic and panorama UI in `content/panorama/src` and `game/scripts/src`.

- please check `gulpfile.ts` for more details.

### Supported commands

1. `yarn launch [[addon_name] map_name]` launches dota2, all parameters are optional, if `addon_name` is provided then the specified addon will be loaded (default to launch this project), if `map_name` is provided then the corresponding map name will be loaded automatically (if addon_name is not provided then the current addon will be loaded by default)
2. `yarn dev` enter dev mode to compile the ts source code and watch the changes of the files.
3. `yarn prod` to run `publish` operation, it will automatically generate `publish` folder and automatically link to `dota_addons/you_addon_name_publish` folder, then you can choose this folder to publish (you can set some settings for publishing in `package.json -> dota_ developer` to make some settings for publishing).
4. `yarn compile` to compile the source contents

### Usage

1. [click use this project as a template to generate your own project](https://github.com/XavierCHN/x-template/generate) or [fork this project](https://github.com/XavierCHN/x-template/fork)
2. install `node.js`, require above Node v14.10.1 ~~ because versions below is not tested ~~
3. clone the generated or fork project
4. open `package.json` and change `name` to your preferred name
5. execute `yarn` to install the dependencies, it should automatically link `content`,`game` folder to your `dota 2 beta/dota_addons/your_preferred_name`, (if you encounter permission problems, please try to restart)
6. `yarn dev` and start your development

### Contents

-   content is synchronized with `dota 2 beta/content/dota_addons/your_addon_name`
-   game is synchronized with `dota 2 beta/game/dota_addons/your_addon_name`
-   shared to write some shared declarations used in `panorama` and `typescript-to-lua`, like `custom net tables`
-   excels to edit kv tables
-   localization to write localization files
-   scripts contains some helper scripts

1. if you need encryption, please check `scripts/publish.js`
2. feel free to submit `issues`
3. contributions are welcome

### Acknowledgements

-   ModDota Community
-   React-panorama is developed by [https://github.com/ark120202](https://github.com/ark120202)
-   Some of the code is from [https://github.com/MODDOTA/TypeScriptAddonTemplate](https://github.com/MODDOTA/TypeScriptAddonTemplate)
