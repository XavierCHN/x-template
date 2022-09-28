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

import { SingletonGameModule } from './base/singleton';
import { XNetTable } from './xnet-table';

export const ALL_MODULES: SingletonGameModule[] = [
    // 本游戏用到的所有模块，在此处列明
    XNetTable,
];

// @ts-expect-error @eslint-disable-next-line
GameRules.ModuleActivated = GameRules.ModuleActivated ?? false;

export function ActivateAllModules() {
    // @ts-expect-error @eslint-disable-next-line
    GameRules.ModuleActivated = true;
    ALL_MODULES.forEach((m) => {
        m.getInstance().Activate();
    });
}

export function ReloadAllModules() {
    // @ts-expect-error @eslint-disable-next-line
    if (!GameRules.ModuleActivated) {
        return;
    }
    ALL_MODULES.forEach((m) => {
        m.getInstance().Reload();
    });
}
