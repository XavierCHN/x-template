[Russian lang](https://github.com/XavierCHN/x-template/blob/master/readme_rus.md)
# X-Template
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) [![Version](https://img.shields.io/github/release/XavierCHN/x-template.svg)]()
Xavier's dota2 custom game development template (English translated with [DeepL](https://www.deepl.com))

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
- content is synchronized with `dota 2 beta/content/dota_addons/your_addon_name`
- game is synchronized with `dota 2 beta/game/dota_addons/your_addon_name`
- shared to write some shared declarations used in `panorama` and `typescript-to-lua`, like `custom net tables`
- excels to edit kv tables
- localization to write localization files
- scripts contains some helper scripts

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
4. 前端的`content/panorama/src`与后端的`game/scripts/src`文件夹分别用来写用户界面react源码和游戏逻辑的ts源代码


###  支持的指令
1. `npm run launch [[addon_name] map_name]` 启动 dota2，两个参数为可选参数，如果提供了`addon_name`那么会载入指定的 addon（默认该项目），提供了`map_name`则会自动载入对应的地图名（若未提供addon_name则默认载入当前addon）
2. `npm run dev` 进入 dev 模式，将会执行`同步KV到js，生成localization，Excel转KV等操作`
3. `npm run prod` 执行`发布`操作，将会自动生成`publish`文件夹并自动 link 到`dota_addons/you_addon_name_publish`文件夹，之后你可以选择这个文件夹发布（可以在`package.json -> dota_developer`中对发布进行一些设置）。


### 使用步骤
1. [点击使用本项目作为模板生成你自己的项目](https://github.com/XavierCHN/x-template/generate)或者 [fork 本项目](https://github.com/XavierCHN/x-template/fork)
2. 安装`node.js`，要求是 above Node v14.10.1 ~~因为低于这个版本的没有测试过~~
3. clone 生成或者 fork 的项目
4. 打开`package.json`，将`name`修改为你自己喜欢的名字
5. 执行`npm install`安装依赖，他应该会自动 link`content`,`game`文件夹到你的`dota 2 beta/dota_addons`,(如果碰到权限问题，请尝试重启)
6. `npm run dev`，开始你的开发

### 文件夹内容
-   content 会和 `dota 2 beta/content/dota_addons/your_addon_name` 同步更新
-   game 会和 `dota 2 beta/game/dota_addons/your_addon_name` 同步更新
-   shared 用来写`panorama ts`和`tstl`公用的声明，如`custom_net_tables`等
-   excels 用来写 KV 表
-   localization 用来写各种本地化文本
-   scripts 各种 node 脚本，用来完成各种辅助功能
