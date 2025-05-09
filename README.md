# X-Template

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
### [简体中文](https://github.com/XavierCHN/x-template?tab=readme-ov-file#x-template) | [English Readme](https://github.com/XavierCHN/x-template/blob/master/README.EN.MD)  | [Русское описание](https://github.com/XavierCHN/x-template/blob/master/README.RU.MD)


Xavier 的 dota2 自定义游戏开发模板

## 使用步骤
[简单的视频教程（中文） a starter video tutorial (Chinese)](https://www.bilibili.com/video/BV1de4y1s7kw/?vd_source=9bc3eaf21f82a00973f08ff2dbcfd356)


### 新建项目
1. [点击使用本项目作为模板生成你自己的项目](https://github.com/XavierCHN/x-template/generate)或者 [fork 本项目](https://github.com/XavierCHN/x-template/fork)
2. 安装 [node.js](https://nodejs.org)
3. 使用 git clone 你自己的项目
4. 安装好 [vscode](https://code.visualstudio.com/download)，使用vscode打开clone的文件夹
5. 打开 `scripts/addon.config.ts`，将 `addon_name` 修改为你想要使用的项目名称
6. 执行 `yarn install`安装依赖
7. 执行 `yarn dev` 开始你的开发
8. **你可以使用指令`yarn launch map_name` 快速启动测试，或者使用 `yarn launch` 指令只启动工具**


### 使用这个模板的好处
1. 可以使用更为`现代`的语言([typescript](https://www.typescriptlang.org/))来进行开发，且前后端均使用 `typescript` 开发
2. 使用表格工具来填写并管理你的 `kv` 文件
3. 使用`react`来开发UI可以更好地管理你的代码，而无需掌握`xml`的写法。
4. 帮助解决了V社的工具中诸如`UI无法读取KV文件`，`UI图片不会自动编译`等问题。
5. 加密发布代码的支持，可以帮助你保护一些关键代码。
6. 新增了火焰图性能分析工具支持，请查看 [火焰图性能分析模块使用说明](https://github.com/XavierCHN/x-template/blob/master/game/scripts/src/utils/performance/flame_graph_profiler.md)。


### 支持的功能
1. 前端的`content/panorama/src`与后端的`game/scripts/src`文件夹分别用来写用户界面 react 源码和游戏逻辑的 ts 源代码
2. 将你的 excel 文件变成 kv 文件并放到`game/scripts/npc`文件夹，同时在panorama和scripts文件夹生成与每个kv文件对应的json文件，这样你的ts代码可以很方便地获取kv数据
3. 将 `addon.csv` 变成 `addon_*.txt`，(也可以把 `addon_*.txt` 变成 `addon.csv`)
4. 将服务器API转换为typescript接口，同时提供了一个有效的请求类用来处理请求，使用的是 [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)

### 支持的指令

1. **推荐使用`yarn launch [[addon_name] map_name]`直接启动项目进行开发**
2. `yarn dev` 进入 dev 模式，将会执行编译操作，在开发时请保持编译状态
3. `yarn prod` 执行`发布`或者`加密发布`操作
4. `yarn api` 生成与 `scripts/server_api.json` （需要符合**Swagger 3.0规范**）的API一致的请求类，并储存于 `game/scripts/src/server/services`，关于请求实现的细节，请查阅 `game/scripts/src/server/core` 文件夹

### 文件夹内容说明
-   content 会和 `dota 2 beta/content/dota_addons/your_addon_name` 同步更新
-   game 会和 `dota 2 beta/game/dota_addons/your_addon_name` 同步更新
-   shared 用来写`panorama ts`和`tstl`公用的声明，如`custom_net_tables`等
-   scripts 各种 node 脚本，用来完成各种辅助功能
-   请仔细查阅 `gulpfile.ts` 来查看 gulp 的使用方法


### DOTA2 Modding 工具推荐

- [node.js](https://nodejs.org/en/), [LuaForWindows](http://luabinaries.sourceforge.net/) , [Python](https://www.python.org/) 等一系列环境的配置请自行使用搜索引擎完成，不赘述。
- 只推荐使用`steam`启动dota2的形式来完成modding，如果尚未安装，请[点此下载](https://store.steampowered.com/about/)

##### 需要安装的软件包括：
1. 代码编辑器 [Visual Studio Code](https://code.visualstudio.com) 或者其他你习惯使用的typescript代码编辑器
2. 反编译工具 [ValveResourceFormat](https://github.com/SteamDatabase/ValveResourceFormat/releases)（推荐）或者 [GCFScape](https://nemstools.github.io/pages/GCFScape-Download.html)(已略过时，某些格式反编译不了，但是速度比较快，推荐都安装)
3. Adobe系列工具, 如PhotoShop（必须）, Audition（选装）等，请到 [官网](https://www.adobe.com/) 下载或自行使用搜索引擎获取
4. 代码版本控制 [Github Desktop](https://desktop.github.com/)（推荐，和github的配合比较好） 或 [SourceTree](https://www.sourcetreeapp.com/) 或 [TortoiseSVN](https://tortoisesvn.net/index.zh.html)
5. 模型编辑器Blender Steam直接安装【steam://install/365670】 [Steam商店页面](https://store.steampowered.com/app/365670/Blender/) （用自己顺手的就行，如果不涉及模型编辑可略过）
6. 其他实用工具： [文件搜索工具Everything](https://www.voidtools.com/zh-cn/) [Deepl翻译](https://www.deepl.com/translator) [Node版本控制nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

### 常见问题
- 执行 `yarn install` 出现权限问题报错怎么办？
  - 请尝试关闭代码编辑器后，使用控制台来执行`yarn install`，或者重启一下电脑再试
- 因为网络问题导致安装错误怎么办？
  - 可以尝试使用[npmmirror镜像](https://npmmirror.com/)，或者直接执行`yarn config set registry https://registry.npmmirror.com`再执行`yarn install`
- 如何在保持 `yarn dev` 状态下再执行其他指令？
  - 在 `vscode` 中，你可以使用**ctrl+shift+5**来同时打开多个**terminal**终端
- 如何获取加密所需的秘钥？
  - 你可以使用本项目提供的 Debug 代码指令，先不加密上传，使用 `get_key_v3 [version]` 指令获取秘钥，之后再加密上传覆盖，具体的实现请 [查阅代码](https://github.com/XavierCHN/x-template/blob/master/game/scripts/src/modules/Debug.ts#L32-L38)
- 有没有相关的教程？
  - TODO：制作相关教程

### 其他
- 如果你在DOTA2自定义游戏制作过程中遇到了任何问题，可以到本项目的 [Issues页面](https://github.com/XavierCHN/x-template/issues) 提问，如果我知道的将会予以解答。
- 代码写累了也可以玩玩 dota，你可以使用 `yarn launch do` 启动正常（非工具模式的dota2），也可以使用 `yarn launch dop` 来启动带 `-perfectworld` 参数的dota2
