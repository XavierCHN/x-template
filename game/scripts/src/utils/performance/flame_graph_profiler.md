# 火焰图性能分析模块使用说明

## 1. 模块简介

火焰图性能分析模块是一个用于Dota2自定义游戏的性能监控工具，可以帮助开发者识别和解决游戏中的性能瓶颈。该模块通过收集函数调用信息并生成火焰图数据，直观地展示各个函数的执行时间和调用关系。

### 1.1 主要功能

- **函数性能监控**：记录函数调用时间、调用次数和调用层级关系
- **装饰器支持**：提供方法装饰器和类装饰器，轻松为函数添加性能监控
- **实时数据同步**：将性能数据实时同步到网表，支持在游戏中查看
- **可视化展示**：通过火焰图直观展示性能数据，帮助定位性能瓶颈

## 2. 使用方法

### 2.1 基本用法

```typescript
// 导入模块
import { GetFlameGraphProfiler, Profile, ProfileClass } from './performance/flame_graph_profiler';

// 获取性能分析器实例
const profiler = GetFlameGraphProfiler();

// 开始记录性能数据（参数为记录持续时间，单位秒，0表示持续记录直到手动停止）
profiler.startRecording(60);

// 暂停记录
profiler.pauseRecording();

// 恢复记录
profiler.resumeRecording();

// 停止记录
profiler.stopRecording();
```

### 2.2 使用装饰器监控函数

#### 2.2.1 方法装饰器

```typescript
class MyClass {
    // 使用默认名称（类名.方法名）
    @Profile()
    public myMethod(): void {
        // 方法实现...
    }
  
    // 使用自定义名称
    @Profile('自定义名称')
    public customNameMethod(): void {
        // 方法实现...
    }
}
```

#### 2.2.2 类装饰器

```typescript
// 定义类
@ProfileClass // 为类的所有方法添加性能分析
class MyClass {
    public method1(): void { /* ... */ }
    public method2(): void { /* ... */ }
    private method3(): void { /* ... */ }
}

// 创建实例并使用
const instance = new MyClass();
instance.method1(); // 已被性能分析装饰器包装
```

### 2.3 手动监控函数

```typescript
class ManualProfileExample {
    private profiler = GetFlameGraphProfiler();
  
    public someMethod(): void {
        // 手动开始记录函数
        this.profiler.enterFunction('ManualProfileExample.someMethod');
      
        // 函数实现...
      
        // 手动结束记录函数
        this.profiler.exitFunction();
    }
}
```

## 3. 命令行控制

火焰图性能分析模块支持通过聊天命令进行控制：

- `-perf_start [持续时间]`：开始记录性能数据，可选参数为持续时间（秒）
- `-perf_stop`：停止记录性能数据
- `-perf_pause`：暂停记录性能数据
- `-perf_resume`：恢复记录性能数据

## 4. 火焰图解读

### 4.1 火焰图基本概念

- **横轴**：表示时间占比，宽度越大表示耗时越长
- **纵轴**：表示调用栈，从下到上是调用关系
- **颜色**：根据函数名称自动生成，相同函数具有相同颜色

### 4.2 如何分析火焰图

1. **寻找宽度大的函数块**：这些是耗时较长的函数，可能是性能瓶颈
2. **关注调用频繁的函数**：即使单次耗时不长，但频繁调用也会影响性能
3. **分析调用栈深度**：过深的调用栈可能表示代码结构需要优化
4. **比较不同时间段的火焰图**：找出性能变化的原因

## 5. 最佳实践

- 在开发环境中使用，生产环境可以通过注释切换到空装饰器
- 针对性能敏感的模块和函数进行监控，而不是全部代码
- 定期进行性能分析，及时发现和解决性能问题
- 结合其他性能工具（如网络监控、内存分析等）综合分析

## 6. 注意事项

- 性能分析本身会带来一定的性能开销，特别是在监控大量函数时
- 过于频繁的函数调用可能导致数据量过大，影响分析效率
- 建议在测试环境中使用，或在特定时间段开启监控

## 7. 示例代码

请参考 `flame_graph_profiler_test.ts` 文件，其中包含了完整的使用示例。

---

*更新日期：2025-04-16*
