/**
 * 火焰图性能分析模块测试用例
 * 用于演示如何使用火焰图性能分析工具进行函数性能监控
 * 日期: 2025-04-16
 */

import { GetFlameGraphProfiler, Profile, ProfileClass } from './flame_graph_profiler';
import { InitFlameGraphCommands, FlameGraphCommands } from './flame_graph_commands';

/**
 * 测试类 - 使用单个方法装饰器
 */
class ProfileDecoratorTest {
    // 使用Profile装饰器监控单个方法
    @Profile()
    public testMethod1(): void {
        // 模拟耗时操作
        this.simulateWork(50);

        // 调用其他方法
        this.testMethod2();
    }

    // 使用自定义名称的Profile装饰器
    @Profile('自定义方法名.testMethod2')
    private testMethod2(): void {
        // 模拟耗时操作
        this.simulateWork(30);
    }

    // 未被监控的方法
    private simulateWork(ms: number): void {
        const startTime = GetSystemTimeMS();
        while (GetSystemTimeMS() - startTime < ms) {
            // 空循环模拟工作
        }
    }
}

/**
 * 测试类 - 使用类装饰器监控所有方法
 */
@ProfileClass
class ProfileClassTest {
    public testMethod1(): void {
        // 模拟耗时操作
        this.simulateWork(40);

        // 调用其他方法
        this.testMethod2();
    }

    public testMethod2(): void {
        // 模拟耗时操作
        this.simulateWork(25);

        // 嵌套调用
        this.testMethod3();
    }

    private testMethod3(): void {
        // 模拟耗时操作
        this.simulateWork(15);
    }

    private simulateWork(ms: number): void {
        const startTime = GetSystemTimeMS();
        while (GetSystemTimeMS() - startTime < ms) {
            // 空循环模拟工作
        }
    }
}

/**
 * 手动性能分析测试类
 */
class ManualProfileTest {
    private profiler = GetFlameGraphProfiler();

    public testManualProfiling(): void {
        // 手动开始记录函数
        this.profiler.enterFunction('ManualProfileTest.testManualProfiling');

        // 模拟耗时操作
        this.simulateWork(60);

        // 嵌套函数调用
        this.nestedFunction();

        // 手动结束记录函数
        this.profiler.exitFunction();
    }

    private nestedFunction(): void {
        // 手动开始记录函数
        this.profiler.enterFunction('ManualProfileTest.nestedFunction');

        // 模拟耗时操作
        this.simulateWork(35);

        // 手动结束记录函数
        this.profiler.exitFunction();
    }

    private simulateWork(ms: number): void {
        const startTime = GetSystemTimeMS();
        while (GetSystemTimeMS() - startTime < ms) {
            // 空循环模拟工作
        }
    }
}

//检测类,用可预期的性能评估检测对于单个大函数和小函数的误差值
@ProfileClass
class Debug_Test {
    constructor() {
        Timers.CreateTimer(() => {
            this.Test();
            for (let i = 0; i < 10000; i++) {
                this.Test2();
            }
            return 0.2;
        });
    }

    //预期比test2性能消耗多一点
    Test() {
        for (let i = 0; i < 10000; i++) {
            math.random(0, 10000);
            math.random(0, 10000);
            math.random(0, 10000);
            math.random(0, 10000);
        }
    }

    Test2() {
        math.random(0, 10000);
        math.random(0, 10000);
        math.random(0, 10000);
        math.random(0, 10000);
    }
}

export class FlameGraphProfilerTests {
    constructor() {
        //初始化
        InitFlameGraphCommands();
        print('初始化性能测试!');
        ListenToGameEvent(`player_chat`, keys => this.OnPlayerChat(keys), this);
    }

    OnPlayerChat(keys: GameEventProvidedProperties & PlayerChatEvent): void {
        const strs = keys.text.split(' ');
        const cmd = strs[0];
        const args = strs.slice(1);

        if (cmd === '-test') {
            FlameGraphCommands.getInstance().handleStart();
            new Debug_Test();
        }
        if (cmd === '-test2') {
            // 测试单个方法装饰器
            FlameGraphCommands.getInstance().handleStart();
            print('测试单个方法装饰器...');
            const decoratorTest = new ProfileDecoratorTest();
            for (let i = 0; i < 5; i++) {
                decoratorTest.testMethod1();
            }

            // 测试类装饰器
            print('测试类装饰器...');
            const classTest = new ProfileClassTest();

            for (let i = 0; i < 5; i++) {
                classTest.testMethod1();
            }

            // 测试手动性能分析
            print('测试手动性能分析...');
            const manualTest = new ManualProfileTest();
            for (let i = 0; i < 5; i++) {
                manualTest.testManualProfiling();
            }
            FlameGraphCommands.getInstance().handleStop();
        }
    }
}
