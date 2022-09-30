/**
 * 游戏模块管理器食用方法：
 * 1. 在 modules 文件夹下面创建一个文件，比如叫做 `my-module.ts`
 * 2. 在 `my-module.ts` 里面写一个类，比如叫做 `MyModule`
 * 3. 继承自 `Singleton` 类，比如 `class MyModule extends Singleton`
 * 4. 实现 `Activate` 和 `Reload` 方法，比如
 * ```ts
 * export class MyModule extends Singleton {
 *    Activate() {
 *        // 模块激活时执行的代码
 *    }
 *
 *    Reload() {
 *        // 模块重载时执行的代码
 *    }
 * }
 * ```
 * 5. 在 `index.ts` 里面导入你的模块，比如 `import { MyModule } from './my-module';`
 * 6. 将 MyModule加入 ALL_MODULES 数组。
 */

import { GameConfig } from './GameConfig';
import { XNetTable } from './xnet-table';

declare global {
    interface CDOTAGameRules {
        // 声明所有的GameRules模块
        XNetTable: XNetTable;
    }
}

/**
 * 这个方法会在game_mode实体生成之后调用，且仅调用一次
 * 因此在这里作为单例模式使用
 **/
export function ActivateModules() {
    if (GameRules.XNetTable == null) {
        // 初始化所有的GameRules模块
        GameRules.XNetTable = new XNetTable();
        // 如果某个模块不需要在其他地方使用，那么直接在这里使用即可
        new GameConfig();
    }
}
