# 可拖拽窗口组件 (DraggableWindow)

这是一个通用的可拖拽窗口组件，基于React和Panorama实现。该组件封装了拖拽功能，支持自定义标题、内容和样式，并提供显示/隐藏控制。

## 特性

- 可拖拽：通过拖拽标题栏移动窗口
- 边界限制：自动限制窗口在屏幕边界内
- 自定义样式：支持自定义窗口、标题栏和内容区的样式
- 关闭功能：内置关闭按钮和回调函数
- 灵活布局：支持自定义窗口大小和初始位置

## 使用方法

```tsx
import React, { useState } from 'react';
import DraggableWindow from '../components/draggable_window';

const MyComponent = () => {
    const [windowVisible, setWindowVisible] = useState(true);
    
    const handleCloseWindow = () => {
        setWindowVisible(false);
    };
    
    return (
        <Panel>
            <DraggableWindow
                title="我的窗口"
                visible={windowVisible}
                initialX={200}
                initialY={200}
                width={400}
                height={300}
                icon="url('s2r://panorama/images/control_icons/settings_png.vtex')"
                id="my_window"
            >
                <Panel>
                    <Label text="窗口内容" />
                </Panel>
            </DraggableWindow>
        </Panel>
    );
};
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | string | - | 窗口标题 |
| children | ReactNode | - | 窗口内容 |
| visible | boolean | true | 是否可见 |
| initialX | number | 150 | 窗口初始X坐标 |
| initialY | number | 150 | 窗口初始Y坐标 |
| width | number \| string | 400 | 窗口宽度 |
| height | number \| string | 'auto' | 窗口高度 |
| icon | string | - | 窗口图标URL |
| id | string | 'draggable_window' | 窗口ID |
| onClose | () => void | - | 窗口关闭回调函数 |
| className | string | '' | 窗口自定义类名 |
| titleBarClassName | string | '' | 标题栏自定义类名 |
| contentClassName | string | '' | 内容区自定义类名 |

## 样式自定义

可以通过CSS类名自定义窗口样式：

```less
// 自定义窗口样式
.custom_window {
    border: 2px solid #4488ff;
    
    .window_title_bar {
        background-color: #4488ff;
    }
    
    .window_content {
        background-color: #f0f0f0;
    }
}
```

## 示例

查看 `example.tsx` 文件获取更多使用示例。