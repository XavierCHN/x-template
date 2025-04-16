/**
 * 火焰图性能分析模块
 * 用于收集函数调用信息并生成火焰图数据
 * by: 三村
 * 日期: 2025-04-15
 * version: 1.0.0
 * //@example
 * 示例用法：
 * //@ProfileClass
 * class Myclass{}
 */

const get_time = GetSystemTimeMS;
const sync_time = 5;
interface ProfileNode {
    name: string;
    startTime: number;
    endTime?: number;
    totalTime?: number;
    children: ProfileNode[];
    parent?: ProfileNode;
    calls: number;
}
interface SyncProfileNode {
    name: string;
    totalTime?: number;
    children?: SyncProfileNode[];
    rate?: number;
    calls: number;
}

export class FlameGraphProfiler {
    private static instance: FlameGraphProfiler;
    private rootNode: ProfileNode; // 根节点
    private currentNode: ProfileNode; // 当前节点
    private isRecording: boolean = false; // 是否正在记录
    private startTime: number = 0; // 记录开始时间
    private endTime: number = 0; // 记录结束时间
    private Timerid: string;
    private maxNode = 1;
    private testObj: Test;

    private constructor() {
        this.rootNode = {
            name: 'root',
            startTime: 0,
            children: [],
            calls: 1,
        };
        this.currentNode = this.rootNode;
        this.testObj = new Test();
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): FlameGraphProfiler {
        if (!FlameGraphProfiler.instance) {
            FlameGraphProfiler.instance = new FlameGraphProfiler();
        }
        return FlameGraphProfiler.instance;
    }

    /**
     * 获取当前时间平均偏移量
     */
    private getAverageOffset(): number {
        const test_node = this.rootNode.children[0];
        test_node.totalTime = test_node.totalTime || 0;
        return test_node.totalTime! / test_node.calls || 0;
    }

    /**
     * 执行时间偏移
     */
    private executeTimeOffset(): void {
        //立刻执行
        for (let i = 0; i < 10; i++) {
            this.testObj.time_offet_test();
        }
        //后续每0.1秒执行一次
        Timers.CreateTimer(0.1, () => {
            if (!this.isRecording) return;
            for (let i = 0; i < 10; i++) {
                this.testObj.time_offet_test();
            }
            return 0.1;
        });
    }

    /**
     * 开始记录性能数据
     * @param duration 记录持续时间（秒），0表示持续记录直到手动停止
     */
    public startRecording(duration: number = 0): void {
        if (this.isRecording) {
            print('[FlameGraphProfiler] 已经在记录中，请先停止当前记录');
            return;
        }

        // 重置数据
        this.rootNode = {
            name: 'root',
            startTime: get_time(),
            children: [],
            calls: 1,
        };
        this.currentNode = this.rootNode;
        this.startTime = get_time();
        this.isRecording = true;
        this.executeTimeOffset(); //保证时间偏移量在第一个函数调用
        print(`[FlameGraphProfiler] 开始记录性能数据${duration > 0 ? `，持续${duration}秒` : ''}`);

        // 如果设置了持续时间，则自动停止
        if (duration > 0) {
            this.Timerid = Timers.CreateTimer(duration, () => {
                this.stopRecording();
                return null;
            });
        } else {
            this.Timerid = Timers.CreateTimer(sync_time, () => {
                if (!this.isRecording) return;
                const rootNodeChildren = this.transformNode(this.rootNode);
                rootNodeChildren.totalTime = this.getTotalTime(rootNodeChildren);
                rootNodeChildren.rate = Math.round((rootNodeChildren.totalTime / (get_time() - this.startTime)) * 10000 * this.maxNode);
                this.syncToNetTable(rootNodeChildren);
                print(`[FlameGraphProfiler] 性能诊断运行中..`);
                return sync_time;
            });
        }
    }

    /**
     * 停止记录性能数据
     */
    public stopRecording(): void {
        if (this.Timerid) Timers.RemoveTimer(this.Timerid);
        this.Timerid = null;

        this.isRecording = false;
        this.endTime = get_time();

        // 计算根节点总时间
        this.rootNode.endTime = this.endTime;
        this.rootNode.totalTime = this.endTime - this.rootNode.startTime;
        const rootNodeChildren = this.transformNode(this.rootNode);
        rootNodeChildren.totalTime = this.getTotalTime(rootNodeChildren);
        rootNodeChildren.rate = Math.round((rootNodeChildren.totalTime / (this.endTime - this.startTime)) * 10000 * this.maxNode);
        DeepPrintTable(rootNodeChildren);
        this.syncToNetTable(rootNodeChildren);
        print(`[FlameGraphProfiler] 记录已停止，总时间: ${this.endTime - this.startTime}毫秒,P键打开火焰图`);
    }

    /**
     * 暂停记录性能数据
     */
    public pauseRecording(): void {
        if (!this.isRecording) {
            print('[FlameGraphProfiler] 没有正在进行的记录');
            return;
        }

        this.isRecording = false;
    }

    /**
     * 恢复记录性能数据
     */
    public resumeRecording(): void {
        if (this.isRecording) {
            print('[FlameGraphProfiler] 已经在记录中');
            return;
        }

        this.isRecording = true;
        print('[FlameGraphProfiler] 已恢复记录性能数据');
    }

    //递归遍历node,将node及所有子节点转化为同步数据
    private transformNode(node: ProfileNode): SyncProfileNode {
        const result: SyncProfileNode = {
            name: node.name,
            totalTime: Math.round(node.totalTime || 0),
            calls: node.calls,
        };
        if (node.children.length == 0) return result;
        result.children = [];
        for (const child of node.children) {
            result.children.push(this.transformNode(child));
        }
        return result;
    }

    //获取下一级总运行时间
    private getTotalTime(node: SyncProfileNode): number {
        let totalTime = 0;
        if (node.children) {
            for (const child of node.children) {
                totalTime += child.totalTime;
            }
        }
        return totalTime;
    }

    /**
     * 进入函数
     * @param functionName 函数名称
     */
    public enterFunction(functionName: string): void {
        if (!this.isRecording) return;

        // 查找当前节点的子节点中是否已存在同名函数节点
        let existingNode: ProfileNode | undefined;
        for (const child of this.currentNode.children) {
            if (child.name === functionName) {
                existingNode = child;
                break;
            }
        }

        if (existingNode) {
            // 如果存在同名节点，增加调用次数，更新开始时间
            existingNode.calls++;
            existingNode.parent = this.currentNode; // 确保父节点正确
            existingNode.startTime = get_time();
            this.currentNode = existingNode;
        } else {
            // 如果不存在，创建新节点
            const newNode: ProfileNode = {
                name: functionName,
                startTime: get_time(),
                children: [],
                parent: this.currentNode,
                calls: 1,
            };
            this.currentNode.children.push(newNode);
            this.currentNode = newNode;
        }
    }

    /**
     * 退出函数
     */
    public exitFunction(): void {
        if (!this.isRecording || this.currentNode === this.rootNode) return;

        const now = get_time();
        this.currentNode.endTime = math.max(0.00001, now - this.getAverageOffset());
        this.currentNode.totalTime = (this.currentNode.totalTime || 0) + (this.currentNode.endTime - this.currentNode.startTime);
        // 返回父节点
        if (this.currentNode.parent) {
            this.currentNode = this.currentNode.parent;
        }
    }

    /**
     * 创建性能分析装饰器
     * @param name 函数名称
     */
    public static profile(name?: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value as Function;
            const profilerName = name || `${target.constructor.name}.${propertyKey}`;

            descriptor.value = function (...args: any[]) {
                const profiler = FlameGraphProfiler.getInstance();
                profiler.enterFunction(profilerName);

                let result: any;
                try {
                    if (!args) {
                        result = originalMethod.apply(this);
                    } else {
                        result = originalMethod.apply(this, args);
                    }
                } catch (error) {
                    print('函数执行出错:', error);
                    throw error;
                } finally {
                    profiler.exitFunction();
                }

                return result;
            };

            print('[FlameGraphProfiler] 装饰器已应用于:', profilerName);
            return descriptor;
        };
    }

    /**
     * 批量为类的所有方法添加性能分析
     * @param classInstance 类实例
     * @param prefix 函数名前缀
     */
    public static profileClass(classInstance: any, prefix: string = ''): void {
        const className = classInstance.name;

        // 直接遍历实例上的所有方法
        for (const name in classInstance.prototype) {
            // 跳过非函数属性和内部属性
            if (typeof classInstance.prototype[name] !== 'function' || name.startsWith('__')) {
                continue;
            }

            // 保存原始方法
            const originalMethod = classInstance.prototype[name] as Function;
            const fullName = `${className}.${name}`;
            // 替换为带性能分析的方法
            classInstance.prototype[name] = function (...args: any[]) {
                const profiler = FlameGraphProfiler.getInstance();
                profiler.enterFunction(fullName);
                let result: any;
                try {
                    if (!args) {
                        result = originalMethod.apply(this);
                    } else {
                        result = originalMethod.apply(this, args);
                    }
                } catch (error) {
                    print('函数执行出错:', error);
                    throw error;
                } finally {
                    profiler.exitFunction();
                }

                return result;
            };
            print(`[FlameGraphProfiler] 已为 ${fullName} 添加性能分析`);
        }
        classInstance.prototype.print = '123';
        print(`[FlameGraphProfiler] 已为 ${className} 的所有方法添加性能分析`);
    }

    // 同步当前调用栈信息到网表，用于可视化
    public syncToNetTable(rootNodeChildren: any): void {
        GameRules.XNetTable.SetTableValue(`performance_debug`, `debug_data`, rootNodeChildren);
    }
}

// 导出单例获取函数
export function GetFlameGraphProfiler(): FlameGraphProfiler {
    return FlameGraphProfiler.getInstance();
}

// 空装饰器,关闭性能检测
const emptyDecorator = (str: string) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        return descriptor;
    };
};

//类空装饰器
const emptyClassDecorator = (target: any) => {
    return target;
};

// 导出装饰器
export const Profile = FlameGraphProfiler.profile;
export const ProfileClass = FlameGraphProfiler.profileClass;

//用以测试平均时间偏移量的类
class Test {
    @Profile()
    time_offet_test() {}
}

//导出空装饰器,关闭性能检测,
// export const Profile = emptyDecorator;
// export const ProfileClass = emptyClassDecorator;
