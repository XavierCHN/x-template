# X-Template

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![React](https://img.shields.io/badge/React-16.14-61dafb.svg)
![Dota 2 Modding](https://img.shields.io/badge/Dota%202-Modding-red.svg)

### [简体中文](#x-template) | [English](https://github.com/XavierCHN/x-template/blob/master/README.EN.MD) | [Русский](https://github.com/XavierCHN/x-template/blob/master/README.RU.MD)

---

> **Xavier 的 Dota 2 自定义游戏（Custom Game）开发模板**  
> 基于 TypeScript + React 技术栈，提供从开发、调试到发布的一站式解决方案。

---

## 目录

- [快速开始](#快速开始)
- [项目特性](#项目特性)
- [项目结构](#项目结构)
- [配置说明](#配置说明)
- [可用命令](#可用命令)
- [开发工作流](#开发工作流)
- [发布流程](#发布流程)
- [核心功能详解](#核心功能详解)
- [工具推荐](#工具推荐)
- [常见问题 FAQ](#常见问题-faq)
- [学习资源](#学习资源)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 快速开始

> 如果你是新手，建议先观看 [视频教程（B站）](https://www.bilibili.com/video/BV1de4y1s7kw) 了解基本使用流程。

### 前置要求

| 软件 | 最低版本 | 说明 |
|------|---------|------|
| [Node.js](https://nodejs.org/) | >= 16.0.0 | JavaScript 运行时 |
| [Git](https://git-scm.com/) | 任意版本 | 版本控制 |
| [Dota 2](https://store.steampowered.com/app/570/Dota_2/) | 最新版 | 通过 Steam 安装 |
| [VSCode](https://code.visualstudio.com/) | 推荐 | TypeScript 编辑器 |

### 5 分钟上手

```bash
# 1. 使用本项目作为模板创建你的仓库
#    访问 https://github.com/XavierCHN/x-template 点击 "Use this template"

# 2. 克隆你的项目到本地
git clone https://github.com/你的用户名/你的项目名.git
cd 你的项目名

# 3. 安装依赖
yarn install

# 4. 修改项目名称
#    打开 scripts/addon.config.ts，将 addon_name 改为你想要的名称

# 5. 启动开发模式
yarn dev

# 6. 启动 Dota 2 工具模式进行测试
yarn launch
```

---

## 项目特性

### 为什么选择 X-Template？

- **TypeScript 全栈开发** — 前端 UI 和后端游戏逻辑均使用 TypeScript，统一开发语言
- **React 构建 UI** — 告别繁琐的 XML，使用组件化方式开发 Panorama 界面
- **Excel 数据管理** — 用表格工具编辑游戏数值配置，自动转换为 KV 文件
- **自动化构建** — Gulp + Webpack 自动处理资源编译、文件同步等重复工作
- **代码加密发布** — 支持 Lua 代码加密，保护核心逻辑不被轻易反编译
- **OpenAPI 集成** — 自动生成 TypeScript API 客户端，前后端接口类型安全
- **性能分析工具** — 内置火焰图性能分析器，帮助优化游戏性能
- **本地化支持** — CSV 与多语言 addon_*.txt 文件双向转换

---

## 项目结构

```
x-template/
├── content/                    # 客户端资源（同步至 dota 2 beta/content/dota_addons/）
│   └── panorama/
│       ├── src/                # React UI 源代码 (.tsx)
│       │   ├── json/           # 自动生成的 KV 对应 JSON 文件
│       │   └── ...
│       ├── images/             # UI 图片资源
│       ├── layout/             # Panorama 布局文件
│       └── styles/             # LESS 样式文件
│
├── game/                       # 服务端游戏逻辑（同步至 dota 2 beta/game/dota_addons/）
│   └── scripts/
│       ├── src/                # TypeScript 游戏逻辑源代码
│       │   ├── server/         # 服务器 API 相关代码
│       │   ├── json/           # 自动生成的 KV 对应 JSON 文件
│       │   └── modules/        # 游戏模块
│       └── npc/                # KV 配置文件（由 Excel 自动生成）
│
├── excels/                     # Excel 数据表格（游戏数值配置）
│   ├── 单位表.xlsx
│   ├── 技能表.xlsx
│   ├── 物品表.xlsx
│   └── ...
│
├── shared/                     # 前后端共享类型声明
│   ├── gameevents.d.ts         # 游戏事件类型定义
│   ├── net_tables.d.ts         # 网络表类型定义
│   └── x-net-table.d.ts        # 自定义网络表类型定义
│
├── scripts/                    # Node.js 构建脚本
│   ├── addon.config.ts         # 项目配置文件（项目名称、加密设置等）
│   ├── launch.ts               # 启动脚本
│   ├── install.ts              # 安装后处理脚本
│   ├── publish.ts              # 发布脚本
│   └── ...
│
├── gulpfile.ts                 # Gulp 构建配置
├── package.json                # 项目依赖和脚本
└── tsconfig.json               # TypeScript 配置
```

---

## 配置说明

### 修改项目名称

打开 `scripts/addon.config.ts`，修改 `addon_name`：

```typescript
let addon_name: string = 'your_addon_name';
```

> **注意**：名称必须为字母开头，只能包含小写字母、数字和下划线（`/^[a-z][a-z0-9_]*$/`）

### 代码加密配置

```typescript
const encrypt_files: string[] = [
    '**/*.lua',                           // 加密所有 Lua 文件
    '!game/scripts/vscripts/lualib_bundle.lua',  // 排除项
    '!game/scripts/vscripts/addon_init.lua',
    // ... 更多排除规则
];
```

### 发布密钥设置

```typescript
// 本地测试密钥（通常无需修改）
const encryptDedicatedServerKeyTest: string = `Invalid_NotOnDedicatedServer`;

// 测试图密钥（运行 yarn prod 时需要）
const encryptDedicatedServerKeyRelease_Test: string = `你的测试图密钥`;

// 正式图密钥
const encryptDedicatedServerKeyRelease: string = `你的正式图密钥`;
```

> **获取密钥方法**：先不加密上传一次，使用游戏内指令 `get_key_v3 [version]` 获取密钥，然后再加密上传覆盖。详见 [Debug.ts](https://github.com/XavierCHN/x-template/blob/master/game/scripts/src/modules/Debug.ts#L32-L38)

---

## 可用命令

| 命令 | 说明 |
|------|------|
| `yarn dev` | 启动开发模式（监听文件变化，自动编译） |
| `yarn launch [addon_name] [map_name]` | 启动 Dota 2 工具模式（推荐） |
| `yarn prod` | 构建并发布（支持加密） |
| `yarn api` | 从 `scripts/server_api.json` 生成 API 客户端代码 |
| `yarn lint` | 检查并修复代码风格问题 |
| `yarn jssync` | 手动同步 Excel → KV → JSON |
| `yarn compile` | 手动编译资源 |

### 启动参数说明

```bash
yarn launch                    # 仅启动 Dota 2 工具
yarn launch your_addon         # 启动工具并加载指定 addon
yarn launch your_addon test    # 启动工具并加载 addon 及地图
yarn launch do                 # 启动普通 Dota 2（非工具模式）
yarn launch dop                # 启动完美世界服 Dota 2
```

---

## 开发工作流

### 推荐的开发流程

```
1. yarn dev（保持运行，监听文件变化）
         ↓
2. 编写代码（game/scripts/src 或 content/panorama/src）
         ↓
3. 修改 Excel 数据（excels/）→ 自动生成 KV 和 JSON
         ↓
4. yarn launch [addon] [map]（启动测试）
         ↓
5. 重复 2-4 直到满意
```

## 发布流程

```bash
# 1. 确保已正确设置发布密钥（见配置说明）

# 2. 执行发布
yarn prod

# 发布流程会自动执行以下步骤：
# - 执行 gulp predev（Excel → KV → JSON，CSV → 本地化，图片预缓存）
# - 生产环境 Webpack 打包（压缩优化）
# - TSTL 生产环境编译
# - 代码加密（根据 encrypt_files 配置）
# - 复制到发布目录
```

### 发布目录

发布后的文件会输出到 `dota 2 beta/game/dota_addons/{addon_name}_publish/`，可直接用于上传至 Dota 2 创意工坊。

使用 `yarn launch {addon_name}_publish` 可以直接启动创意工坊工具进行上传。

---

## 核心功能详解

### Excel → KV 转换

将 `excels/` 目录下的 Excel 文件自动转换为 Dota 2 的 KV 格式配置文件，输出到 `game/scripts/npc/`。

- 支持 `.xlsx` 和 `.xls` 格式
- 自动忽略以 `_` 开头的 Sheet 和默认的 Sheet1/Sheet2/Sheet3
- 支持本地化标签（`#Loc{}`）自动导出到 `kv_generated.csv`

### KV → JSON 转换

将 KV 文件自动转换为 JSON 文件，分别输出到：
- `game/scripts/src/json/` — 供游戏逻辑 TypeScript 代码使用
- `content/panorama/src/json/` — 供 Panorama UI 代码使用

### 本地化处理

支持两种工作流：
- **CSV → addon_*.txt**：编辑 `game/resource/addon.csv`，自动生成各语言本地化文件
- **addon_*.txt → CSV**：从现有本地化文件反向生成 CSV，方便批量编辑

### OpenAPI 客户端生成

```bash
yarn api
```

根据 `scripts/server_api.json`（需符合 Swagger 3.0 规范）自动生成：
- TypeScript 接口定义
- 请求客户端类
- 输出位置：`game/scripts/src/server/services/`

### 火焰图性能分析

项目内置火焰图性能分析器，可用于分析游戏运行时的性能瓶颈。详见 [Flame Graph Profiler 使用说明](https://github.com/XavierCHN/x-template/blob/master/game/scripts/src/utils/performance/flame_graph_profiler.md)。

---

## 工具推荐

### 必备软件

| 工具 | 用途 | 下载 |
|------|------|------|
| [VSCode](https://code.visualstudio.com/) | TypeScript 代码编辑器 | [官网](https://code.visualstudio.com/download) |
| [Steam](https://store.steampowered.com/about/) | 启动 Dota 2 工具模式 | [官网](https://store.steampowered.com/about/) |
| [Node.js](https://nodejs.org/) | JavaScript 运行时 | [官网](https://nodejs.org/) |

### 推荐软件

| 工具 | 用途 | 下载 |
|------|------|------|
| [ValveResourceFormat](https://github.com/SteamDatabase/ValveResourceFormat/releases) | 资源反编译（推荐） | [GitHub](https://github.com/SteamDatabase/ValveResourceFormat) |
| [GCFScape](https://nemstools.github.io/pages/GCFScape-Download.html) | VPK 文件浏览/提取 | [官网](https://nemstools.github.io/pages/GCFScape-Download.html) |
| [Adobe Photoshop](https://www.adobe.com/) | UI 图片编辑 | [官网](https://www.adobe.com/) |
| [Blender](https://store.steampowered.com/app/365670/Blender/) | 3D 模型编辑 | [Steam](steam://install/365670) |
| [GitHub Desktop](https://desktop.github.com/) | Git 版本控制 | [官网](https://desktop.github.com/) |

### 实用工具

- [Everything](https://www.voidtools.com/zh-cn/) — 文件快速搜索
- [DeepL 翻译](https://www.deepl.com/translator) — 高质量翻译
- [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) — Node.js 版本管理

---

## 常见问题 FAQ

### 安装相关

**Q: `yarn install` 出现权限错误怎么办？**  
A: 关闭所有代码编辑器，在终端中重新执行 `yarn install`。如果仍有问题，尝试重启电脑。

**Q: 因为网络问题导致安装失败怎么办？**  
A: 使用 npmmirror 镜像源：
```bash
yarn config set registry https://registry.npmmirror.com
yarn install
```

### 开发相关

**Q: 如何在保持 `yarn dev` 运行的同时执行其他命令？**  
A: 在 VSCode 中使用 `Ctrl + Shift + ~` 打开新终端，或使用 `Ctrl + Shift + 5` 分割终端。

**Q: 如何获取加密所需的密钥？**  
A: 先执行一次不加密的 `yarn prod` 上传，然后在游戏内使用 `get_key_v3 [version]` 指令获取密钥，最后将密钥填入 `addon.config.ts` 并重新加密上传。详见 [Debug.ts](https://github.com/XavierCHN/x-template/blob/master/game/scripts/src/modules/Debug.ts#L32-L38)。

**Q: Excel 修改后没有生效？**  
A: 确保 `yarn dev` 正在运行，或手动执行 `yarn jssync` 进行同步。

**Q: UI 图片没有自动编译？**  
A: `yarn dev` 会自动处理图片预缓存。如果手动操作，可以执行 `gulp create_image_precache`。

### 环境相关

**Q: 支持哪些 Node.js 版本？**  
A: Node.js >= 16.0.0，推荐使用 LTS 版本。

**Q: 是否必须使用 Yarn？**  
A: 项目使用 Yarn 作为包管理器，建议使用 Yarn 以确保依赖版本一致。

---

## 学习资源

- [视频教程（B站）](https://www.bilibili.com/video/BV1de4y1s7kw/?vd_source=9bc3eaf21f82a00973f08ff2dbcfd356) — 快速上手视频
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [React 官方文档](https://react.dev/)
- [TypeScriptToLua 文档](https://typescripttolua.github.io/)
- [ModDota 社区](https://moddota.com/) — Dota 2 Modding 社区
- [Dota 2 Workshop Tools 文档](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools)

---

## 贡献指南

欢迎通过以下方式为本项目做出贡献：

1. **提交 Issue** — 遇到问题请在 [Issues 页面](https://github.com/XavierCHN/x-template/issues) 反馈
2. **提交 PR** — 修复 Bug 或添加新功能，请 Fork 后提交 Pull Request
3. **完善文档** — 帮助改进教程和文档

---

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

Copyright (c) 2021-2026 Xavier Zheng

---

<p align="center">如果这个项目对你有帮助，欢迎 Star ⭐ 支持一下！</p>
