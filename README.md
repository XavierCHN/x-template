[Russian lang](https://github.com/XavierCHN/x-template/blob/master/readme_rus.md)

# X-Template

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) [![Version](https://img.shields.io/github/release/XavierCHN/x-template.svg)]() Xavier's dota2 custom game development template (English translated with [DeepL](https://www.deepl.com))

### Pre-requisites

If you want to use this template, in addition to mastering the Valve's development tools, you need to additionally learn

1. the syntax of `typescript`, `javascript`
2. the basics of `react`
3. the basics of `node.js`
4. learn about [react-panorama](https://github.com/ark120202/react-panorama)
5. learn about [TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua)
6. learn about the `DOTA2 Typescript API`, you can check out `node_modules/dota-lua-types` and `node_modules/panorama-types` after you finish `npm install`.

### Supported features

1. convert the contents of the files in `excels` into a kv file and put it in the `game/scripts/npc`
2. convert the contents of the `localization` folder into a corresponding language file and put it in the `game/resources`
3. sync the contents of the `game/scripts/npc` to `content/panorama/scripts/keyvalues.js`
4. use typescript to write game logic and panorama UI in `content/panorama/src` and `game/scripts/src` respectively

### Supported commands

1. `npm run launch [[addon_name] map_name]` launches dota2, all parameters are optional, if `addon_name` is provided then the specified addon will be loaded (default to launch this project), if `map_name` is provided then the corresponding map name will be loaded automatically (if addon_name is not provided then the current addon will be loaded by default)
2. `npm run dev` enter dev mode to compile the ts source code and watch the changes of the files.
3. `npm run prod` to run `publish` operation, it will automatically generate `publish` folder and automatically link to `dota_addons/you_addon_name_publish` folder, then you can choose this folder to publish (you can set some settings for publishing in `package.json -> dota_ developer` to make some settings for publishing).

### Usage

1. [click use this project as a template to generate your own project](https://github.com/XavierCHN/x-template/generate) or [fork this project](https://github.com/XavierCHN/x-template/fork)
2. install `node.js`, require above Node v14.10.1 ~~ because versions below is not tested ~~
3. clone the generated or fork project
4. open `package.json` and change `name` to your preferred name
5. execute `npm install` to install the dependencies, it should automatically link `content`,`game` folder to your `dota 2 beta/dota_addons/your_preferred_name`, (if you encounter permission problems, please try to restart)
6. `npm run dev` and start your development

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

# X-Template

Xavier 的 dota2 自定义游戏开发模板

### 前置条件

如果你要使用这个模板，除了掌握 V 社的开发工具以外，你还需要额外学会

1. `typescript`, `javascript` 的语法
2. `react` 的基础知识
3. `node.js`的基础知识
4. 学习一下[react-panorama](https://github.com/ark120202/react-panorama)
5. 学习一下[TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua)
6. 了解一下 `DOTA2 Typescript API`，完成`npm install`后你可以查看`node_modules/dota-lua-types`和`node_modules/panorama-types`

### 支持的功能

1. 将`excels`文件夹的内容变成 kv 文件并放到`game/scripts/npc`文件夹
2. 将`localization`文件夹的内容生成对应的语言文件并放到`game/resources`文件夹
3. 将`game/scripts/npc`文件夹的内容同步到`content/panorama/scripts/keyvalues.js`
4. 前端的`content/panorama/src`与后端的`game/scripts/src`文件夹分别用来写用户界面 react 源码和游戏逻辑的 ts 源代码

### 支持的指令

1. `npm run launch [[addon_name] map_name]` 启动 dota2，两个参数为可选参数，如果提供了`addon_name`那么会载入指定的 addon（默认该项目），提供了`map_name`则会自动载入对应的地图名（若未提供 addon_name 则默认载入当前 addon）
2. `npm run dev` 进入 dev 模式，将会执行`同步KV到js，生成localization，Excel转KV等操作`
3. `npm run prod` 执行`发布`操作，将会自动生成`publish`文件夹并自动 link 到`dota_addons/you_addon_name_publish`文件夹，之后你可以选择这个文件夹发布（可以在`package.json -> dota_developer`中对发布进行一些设置）。
    > 加密发布流程

> 将 packages.json 里面的`encryptFiles`根据你的需要修改，哪些文件加密，哪些不加密

> 将`encryptDedicatedServerKey`修改成你的图的 DedicatedServerKey

> 执行`npm run prod`来完成加密流程

> 可以保持现有的 Invalid_NotDedicatedServer 密钥进行加密，之后在本地启动 publish 文件夹看看加密是否正确运行，正式发布再改成正式的 key

> 执行`npm run launch your_addon_name_publish`来启动加密后的图，之后执行上传操作

> 如果要使用加密功能，需要安装 [Lua 命令行程序](http://luabinaries.sourceforge.net/)

### 使用步骤

1. [点击使用本项目作为模板生成你自己的项目](https://github.com/XavierCHN/x-template/generate)或者 [fork 本项目](https://github.com/XavierCHN/x-template/fork)
2. 安装`node.js`，要求是 above Node v14.10.1 ~~因为低于这个版本的没有测试过~~
3. clone 生成或者 fork 的项目
4. 打开`package.json`，将`name`修改为你自己喜欢的名字
5. 执行`npm install`安装依赖，他应该会自动 link`content`,`game`文件夹到你的`dota 2 beta/dota_addons`,(如果碰到权限问题，请关闭代码编辑器后使用控制台来执行`npm install`，或者重启一下电脑再试)
6. `npm run dev`，开始你的开发

### 文件夹内容

-   content 会和 `dota 2 beta/content/dota_addons/your_addon_name` 同步更新
-   game 会和 `dota 2 beta/game/dota_addons/your_addon_name` 同步更新
-   shared 用来写`panorama ts`和`tstl`公用的声明，如`custom_net_tables`等
-   excels 用来写 KV 表，其中以 `__` （两个下划线） 开头的表会被略过
-   localization 用来写各种本地化文本
-   scripts 各种 node 脚本，用来完成各种辅助功能

### 注意事项

-   最好不要使用 node 15 以上的版本，因为这个版本的 node 会有各种问题，如果要使用，请自行解决各类环境问题


### DOTA2 Modding 工具推荐

> [node.js](https://nodejs.org/en/), [LuaForWindows](http://luabinaries.sourceforge.net/) 等一系列环境的配置请自行使用搜索引擎完成，不赘述。

> 只推荐使用`steam`启动dota2的形式来完成modding，如果尚未安装，请[点此下载](https://store.steampowered.com/about/)

##### 需要安装的软件包括：
1. 代码编辑器 [Visual Studio Code](https://code.visualstudio.com) 或者 [Sublime Text 3](http://www.sublimetext.com/3) （推荐都安装）
2. 反编译工具 [ValveResourceFormat](https://github.com/SteamDatabase/ValveResourceFormat/releases)（推荐）或者 [GCFScape](https://nemstools.github.io/pages/GCFScape-Download.html)(已略过时，某些格式反编译不了，但是速度比较快，推荐都安装)
3. Adobe系列工具, 如PhotoShop（必须）, Audition（选装）等，请到 [官网](https://www.adobe.com/) 下载或自行使用搜索引擎获取
4. 代码版本控制 [Github Desktop](https://desktop.github.com/)（推荐，和github的配合比较好） 或 [SourceTree](https://www.sourcetreeapp.com/) 或 [TortoiseSVN](https://tortoisesvn.net/index.zh.html)
5. 模型编辑器Blender Steam直接安装【steam://install/365670】 [Steam商店页面](https://store.steampowered.com/app/365670/Blender/) （用自己顺手的就行，如果不涉及模型编辑可略过）
6. 其他实用工具： [文件搜索工具Everything](https://www.voidtools.com/zh-cn/) [Deepl翻译](https://www.deepl.com/translator) [Node版本控制nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

### 其他
如果你在DOTA2自定义游戏制作过程中遇到了任何问题，可以到本项目的 [Issues页面](https://github.com/XavierCHN/x-template/issues) 提问，如果我知道的将会予以解答。