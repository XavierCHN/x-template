import React, { useState, useRef, useEffect, type FC, type ReactNode } from 'react';
import classnames from 'classnames';

interface DraggableWindowProps {
    /** 窗口标题 */
    title: string;
    /** 窗口内容 */
    children: ReactNode;
    /** 是否可见 */
    visible?: boolean;
    /** 窗口初始位置X坐标 */
    initialX?: number;
    /** 窗口初始位置Y坐标 */
    initialY?: number;
    /** 窗口宽度 */
    width?: number | string;
    /** 窗口高度 */
    height?: number | string;
    /** 窗口图标 */
    icon?: string;
    /** 窗口ID */
    id?: string;
    /** 窗口关闭回调 */
    // onClose?: (visible) => void;
    /** 窗口样式类名 */
    className?: string;
    /** 窗口标题栏样式类名 */
    titleBarClassName?: string;
    /** 窗口内容区样式类名 */
    contentClassName?: string;
    /** 所属面板ID */
    panel_id?: string;
}

/**
 * 通用可拖拽窗口组件
 */
export const DraggableWindow: FC<DraggableWindowProps> = ({
    title,
    children,
    visible = true,
    initialX = 150,
    initialY = 150,
    id = 'draggable_window',
    className = '',
    titleBarClassName = '',
    contentClassName = '',
}) => {
    const positionRef = useRef({ x: initialX, y: initialY });
    const dragStartXRef = useRef(0);
    const dragStartYRef = useRef(0);
    const parentRef = useRef<Panel | null>(null);
    // const animationRef = useRef<AnimationWrapperExportProps | null>(null);

    // 拖拽开始处理函数
    const handleDragStart = (panel: Panel, dragPanel: any) => {
        const parent = panel as Panel;
        parent.style.opacity = '0.5';
        const cursorPosition = GameUI.GetCursorPosition();
        parentRef.current = panel.GetParent();
        // 记录鼠标初始位置
        dragStartXRef.current = cursorPosition[0];
        dragStartYRef.current = cursorPosition[1];
        positionRef.current = panel.GetPositionWithinWindow();
        //@ts-ignore
        dragPanel.displayPanel = parent;
    };

    // 拖拽结束处理函数
    const handleDragEnd = (panel: Panel, dragPanel: Panel) => {
        const parent = panel as Panel;
        const cursorPosition = GameUI.GetCursorPosition();
        parent.style.opacity = '0.8';
        // 结束时的鼠标位置
        const offsetX = cursorPosition[0];
        const offsetY = cursorPosition[1];

        // 计算鼠标移动的距离
        const deltaX = offsetX - dragStartXRef.current;
        const deltaY = offsetY - dragStartYRef.current;

        const newX = positionRef.current.x + deltaX;
        const newY = positionRef.current.y + deltaY;

        positionRef.current = { x: newX, y: newY };
        // 设置面板位置
        const ry = Game.GetScreenHeight() / 1080;

        //重新设置父面板
        if (parentRef.current) {
            parent.SetParent(parentRef.current);
        }
        parent.style.x = `${newX / ry}px`;
        parent.style.y = `${newY / ry}px`;
    };

    // 设置初始位置
    useEffect(() => {
        const ry = Game.GetScreenHeight() / 1080;
        const panel = $(`#${id}`) as Panel;
        if (panel) {
            panel.style.x = `${initialX / ry}px`;
            panel.style.y = `${initialY / ry}px`;
        }
    }, [initialX, initialY, id]);

    if (!visible) {
        return null;
    }

    return (
        <Panel
            id={id}
            className={classnames('draggable_window', className)}
            draggable={true}
            on-ui-DragStart={handleDragStart}
            on-ui-DragEnd={handleDragEnd}
        >
            <Panel className={classnames('window_title_bar', titleBarClassName)}>
                <Label className="window_title" text={title} hittest={false} />
            </Panel>
            <Panel className={classnames('window_content', contentClassName)}>{children}</Panel>
        </Panel>
    );
};

export default DraggableWindow;
