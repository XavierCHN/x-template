# X-Template

Xavier 的 dota2 自定义游戏开发模板 [MAKE ARCADE GREAT AGAIN!]()

[![Version](https://img.shields.io/github/release/XavierCHN/x-template.svg)]()

### 前置条件

如果你要使用本项目，除了掌握 V 社的开发工具以外，你还需要额外学会

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

### 支持的指令

1. `npm run launch [--a addon_name] [--m map_name]` 启动 dota2，如果提供了`addon_name`那么会载入指定的 addon（默认该项目），提供了`map_name`则会自动载入对应的地图名
2. `npm run dev` 进入 dev 模式，将会执行`同步KV到js，生成localization，Excel转KV等操作`
3. `npm run prod` 执行`发布`操作，将会自动生成`publish`文件夹并自动 link 到`dota_addons/you_addon_name_publish`文件夹，之后你可以选择这个文件夹发布

### 使用步骤

1. 使用本项目作为模板生成你自己的项目或者 fork 本项目
2. 安装`node.js`，要求是 above Node v14.10.1 ~~因为低于这个版本的没有测试过~~
3. clone 生成或者 fork 的项目
4. 打开`package.json`，将`name`修改为你自己喜欢的名字
5. 执行`npm install`安装依赖，他应该会自动 link`content`,`game`文件夹到你的`dota 2 beta/dota_addons`,(如果碰到权限问题，请尝试重启)
6. `npm run dev`，开始你的开发

### 其他的工作

1. 如果你需要加密，请自行修改`scripts/publish.js`
2. 欢迎提`issues`
3. 欢迎贡献代码
