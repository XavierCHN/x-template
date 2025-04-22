# X-Template

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
### [简体中文](https://github.com/XavierCHN/x-template?tab=readme-ov-file#x-template) |  [English Readme](https://github.com/XavierCHN/x-template/blob/master/README.EN.MD)   | [Русское описание](https://github.com/XavierCHN/x-template/blob/master/README.RU.MD)

Xavier's Dota 2 Custom Game Development Template

English translated with [DeepSeek](https://www.deepseek.com/)

## Usage Steps
[Quick Video Tutorial (Chinese)](https://www.bilibili.com/video/BV1de4y1s7kw/?vd_source=9bc3eaf21f82a00973f08ff2dbcfd356)

### Create New Project
1. [Click to use this repo as a template](https://github.com/XavierCHN/x-template/generate) or [fork this repo](https://github.com/XavierCHN/x-template/fork)
2. Install [Node.js](https://nodejs.org)
3. `git clone` your own project
4. Install [VSCode](https://code.visualstudio.com/download) and open the cloned folder with VSCode
5. Open `scripts/addon.config.ts`, modify `addon_name` to your project name
6. Run `yarn install` to install dependencies
7. Run `yarn dev` to start development
8. **Use `yarn launch map_name` to quickly launch tests, or `yarn launch` to only launch tools**;

### Benefits
1. Develop with modern language ([TypeScript](https://www.typescriptlang.org/)) for both client and server
2. Manage KV files via spreadsheet tools
3. Use `React` for UI development without writing XML
4. Solves Valve toolchain issues like "UI cannot read KV files" and "UI images not auto-compiling"
5. Supports code encryption for production
6. Flame graph performance analysis - see [Flame Graph Profiler Guide](https://github.com/XavierCHN/x-template/blob/master/game/scripts/src/utils/performance/flame_graph_profiler.md)

### Features
1. Client code in `content/panorama/src` and server code in `game/scripts/src` using TypeScript
2. Convert Excel → KV files in `game/scripts/npc`, with auto-generated JSON files for TS access
3. Bidirectional conversion between `addon.csv` ↔ `addon_*.txt`
4. Generate TS interfaces from server APIs using [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)

### Commands
1. **Recommended: `yarn launch [[addon_name] map_name]`**
2. `yarn dev` - Start dev mode with watch compilation
3. `yarn prod` - Build for production (with optional encryption)
4. `yarn api` - Generate API clients from `scripts/server_api.json` (Swagger 3.0 spec) to `game/scripts/src/server/services`

### Directory Structure
- `content` syncs with `dota 2 beta/content/dota_addons/your_addon_name`
- `game` syncs with `dota 2 beta/game/dota_addons/your_addon_name`
- `shared` contains common TS declarations for panorama and tstl
- `scripts` contains Node.js tooling scripts
- See `gulpfile.ts` for build details

### Recommended DOTA2 Modding Tools
- Environment: [Node.js](https://nodejs.org/), [LuaForWindows](http://luaforwindows.luaforge.net/), [Python](https://www.python.org/)
- Always launch Dota 2 via [Steam](https://store.steampowered.com/about/)

##### Essential Software:
1. Code Editor: [VSCode](https://code.visualstudio.com)
2. Decompilers: [ValveResourceFormat](https://github.com/SteamDatabase/ValveResourceFormat/releases) / [GCFScape](https://nemstools.github.io/pages/GCFScape-Download.html)
3. Adobe Suite: [Photoshop](https://www.adobe.com/), [Audition](https://www.adobe.com/)
4. Version Control: [GitHub Desktop](https://desktop.github.com/), [SourceTree](https://www.sourcetreeapp.com/), [TortoiseSVN](https://tortoisesvn.net/)
5. Modeling: [Blender via Steam](steam://install/365670) ([Store Page](https://store.steampowered.com/app/365670/Blender/))
6. Utilities: [Everything](https://www.voidtools.com/), [DeepL](https://www.deepl.com/translator), [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

### FAQ
- Permission errors during `yarn install`?  
  Close editors and retry in console, or reboot.
- Network issues during install?  
  Use `yarn config set registry https://registry.npmmirror.com` then retry.
- Run multiple commands while keeping `yarn dev`?  
  Use **Ctrl+Shift+5** in VSCode to open multiple terminals.
- Tutorials available?  
  TODO: Create tutorials.

### Others
- For issues, visit [GitHub Issues](https://github.com/XavierCHN/x-template/issues)
- Launch normal Dota 2 with `yarn launch do` or `yarn launch dop` for Perfect World servers
