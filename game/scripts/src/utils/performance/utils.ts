/** 如果遇到卡顿等性能问题，可以直接import此文件，运行一段时间之后在前端界面查看到底是什么类的什么方法占用了大量CPU时间 */
import { ProfileClass } from './flame_graph_profiler';

const IgnoreClasses = ['FlameGraphProfiler', 'Map', 'Set'];

globalThis.__TS_Class__ = function () {
    const c = { prototype: { __index: null, constructor: null } };
    c.prototype.__index = c.prototype;
    c.prototype.constructor = c;
    globalThis.____all_classes = globalThis.____all_classes || {};
    table.insert(globalThis.____all_classes, c);
    return c;
};

Timers.CreateTimer(0.1, () => {
    const classes = globalThis.____all_classes;
    if (classes) {
        for (const cls of classes) {
            if (cls) {
                const name = cls.name;
                if (!IgnoreClasses.includes(name)) {
                    ProfileClass(cls);
                }
            }
        }
    }
});
