import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useGameEvent, useNetTableKey } from 'react-panorama-x';
import DraggableWindow from '../draggable_window/index';
import { useXNetTableKey } from '../../hooks/useXNetTable';
import useToggle from '../../hooks/useToggle';

//获取字符串中是否包含另一个字符串
const containsString = (str1: string, str2: string) => {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    if (str2 == '') return false;
    return str1.indexOf(str2) !== -1;
};

// 定义火焰图数据结构
interface FlameNode {
    name: string;
    calls: number;
    totalTime: number;
    rate?: number;
    children?: Record<string, FlameNode>;
}

// 定义可视化节点结构
interface VisualNode {
    name: string;
    value: number;
    calls: number;
    children?: VisualNode[];
    rate?: number;
}

// 将原始数据转换为可视化数据
const transformData = (node: FlameNode): VisualNode => {
    const result: VisualNode = {
        name: node.name,
        value: node.totalTime,
        calls: node.calls,
        children: [],
    };
    if (node.rate) {
        result.rate = node.rate;
    }
    if (node.children) {
        result.children = Object.values(node.children).map(child => transformData(child));
    }

    return result;
};

// 生成随机颜色
const getRandomColor = (name: string): string => {
    // 使用函数名的哈希值生成一致的颜色
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 生成color颜色，保持饱和度和亮度固定，只变化色相
    const h = Math.abs(hash % 360);
    return `rgb(${Math.floor((h / 100) * 255)}, 155, 100)`;
    // return `gradient(linear, 0% 0%, 100% 100%,from(rgb(${Math.floor((h / 100) * 255)}, 155, 100)), to(rgb(${Math.floor((h / 150) * 255)}, 100, 60)))`;
};

export const FlameGraph: React.FC = () => {
    const [visible, toggleVisible, setVisible] = useToggle(false);
    const panelRef = useRef<Panel | null>(null);
    const [zoomStack, setZoomStack] = useState<VisualNode[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<any>();
    // 获取性能数据
    const performance_debug = useXNetTableKey('performance_debug', 'debug_data', null);
    // 转换数据为可视化格式
    const visualData = useMemo(() => {
        if (!performance_debug) return null;
        try {
            const data = typeof performance_debug === 'string' ? JSON.parse(performance_debug) : performance_debug;
            return transformData(data);
        } catch (e) {
            return null;
        }
    }, [performance_debug]);

    // 当前显示的数据
    const currentData = useMemo(() => {
        if (zoomStack.length > 0) {
            return zoomStack[zoomStack.length - 1];
        }
        return visualData;
    }, [visualData, zoomStack]);

    // 监听游戏事件，显示/隐藏火焰图窗口
    useGameEvent(
        `performance_toggle_flamegraph`,
        () => {
            toggleVisible();
        },
        []
    );

    const SetSearchTextDebounced = (p: TextEntry) => {
        setSearchTerm(p.text);
    };
    // 渲染火焰图节点
    const renderFlameNode = (node: VisualNode, width: number, totalValue: number) => {
        if (!node) return null;

        const nodeWidth = Math.max(2, (node.value / totalValue) * width);
        // 生成节点颜色
        const color = getRandomColor(node.name);

        // 渲染子节点
        const childrenElements = [] as any;
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                childrenElements.push(renderFlameNode(child, width, totalValue) as never);
            }
        }

        return (
            <Panel
                key={`${node.name}`}
                className="FlameNode"
                style={{
                    width: `${nodeWidth}px`,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flowChildren: 'down',
                }}
            >
                <Panel
                    className={'flame_node_self ' + (containsString(node.name, searchTerm) ? 'highlight' : '')}
                    style={{ backgroundColor: color, width: '100%', height: '24px' }}
                    onmouseover={panel => {
                        $.DispatchEvent(
                            'DOTAShowTitleTextTooltip',
                            panel,
                            node.name,
                            `${node.name}<br>time: ${node.value}ms<br>cell: ${node.calls}次`
                        );
                    }}
                    onmouseout={() => {
                        $.DispatchEvent('DOTAHideTitleTextTooltip');
                    }}
                    onactivate={() => {
                        //当点击当前根节点时不处理
                        if (inputRef.current.text === node.name) {
                            if (node.children && node.children.length > 0) {
                                if (node.name === currentData?.name) return;
                                setZoomStack([...zoomStack, node]);
                            }
                        } else {
                            inputRef.current.text = node.name;
                        }
                    }}
                >
                    <Panel className="flame_node_msg_panel" style={{ align: 'center center', flowChildren: 'right' }}>
                        <Label className="flame_node_name" text={node.name} />
                        <Label
                            text={node.value + 'ms'}
                            style={{ fontSize: '12px', color: '#ddd', textShadow: '1px 1px 1px #000', align: 'center center', fontWeight: 'medium' }}
                        />
                        {node.rate && <Label className="flame_node_rate" text={node.rate / 100 + '%'} />}
                    </Panel>
                </Panel>

                <Panel className="flame_children_node" style={{ flowChildren: 'right' }}>
                    {childrenElements}
                </Panel>
            </Panel>
        );
    };

    // 渲染火焰图
    const renderFlameGraph = () => {
        if (!currentData || currentData.value == 0)
            return <Label text="无性能数据" style={{ color: '#fff', fontSize: '16px', align: 'center center' }} />;

        const containerWidth = 680; // 容器宽度
        const totalValue = currentData.value;
        return (
            <Panel className="FlameGraphContainer" style={{ width: '100%', height: '94%' }}>
                {renderFlameNode(currentData, containerWidth, totalValue)}
            </Panel>
        );
    };

    if (!visible) return null;

    //附加状态栏
    const RenderStatusBar = React.memo(() => {
        const [time, setTime] = useState(0);
        //当前检测总时间
        //state:0:未开始,1:开始,2:暂停 time:12 //单位秒
        const performance_state = useXNetTableKey('performance_debug', 'debug_state', null); //{time:0,state:0,sync_interval:0}
        const onStart = () => {
            if (performance_state?.state == 2) {
                GameEvents.SendCustomGameEventToServer('performance_paused', {} as never);
                return;
            }
            GameEvents.SendCustomGameEventToServer('performance_start', {} as never);
        };
        const onPaused = () => {
            GameEvents.SendCustomGameEventToServer('performance_paused', {} as never);
        };
        const onStop = () => {
            GameEvents.SendCustomGameEventToServer('performance_stop', {} as never);
        };
        useEffect(() => {
            if (performance_state) {
                //判定游戏是否暂停
                setTime(performance_state.time || 0);
            }
        }, [performance_state]);

        useEffect(() => {
            let timer: any;
            if (performance_state?.state == 1) {
                timer = setInterval(() => {
                    if (!Game.IsGamePaused()) {
                        setTime(time + 1);
                    }
                }, 1000);
            } else {
                clearInterval(timer);
            }
            return () => {
                clearInterval(timer);
            };
        }, [performance_state, time]);

        //执行时间,单位ms,同步频率
        return (
            <Panel className="FlameGraphFooter">
                {/* //实现一个按钮,点击后开始收集性能数据,再次点击停止 */}
                <Button
                    className="button CollectButton"
                    onactivate={onStart}
                    onmouseover={panel => {
                        $.DispatchEvent('DOTAShowTitleTextTooltip', panel, '开始/恢复', `开始/恢复收集性能数据`);
                    }}
                    onmouseout={() => {
                        $.DispatchEvent('DOTAHideTitleTextTooltip');
                    }}
                />
                <Button
                    className="button PausedButton"
                    onactivate={onPaused}
                    onmouseover={panel => {
                        $.DispatchEvent('DOTAShowTitleTextTooltip', panel, '暂停/恢复', `暂停/恢复收集性能数据`);
                    }}
                    onmouseout={() => {
                        $.DispatchEvent('DOTAHideTitleTextTooltip');
                    }}
                />
                <Button
                    className="button StopButton"
                    onactivate={onStop}
                    onmouseover={panel => {
                        $.DispatchEvent('DOTAShowTitleTextTooltip', panel, '停止', `停止收集性能数据,立刻打印快照`);
                    }}
                    onmouseout={() => {
                        $.DispatchEvent('DOTAHideTitleTextTooltip');
                    }}
                />
                <Panel className={'state_panel state_' + (performance_state?.state || 0)}></Panel>
                <Label className="text_label" text={'time: ' + time + 's'}></Label>
                {/* <Label className="text_label" text={'sync_interval: ' + (performance_state?.sync_interval || 60) + 's'}></Label> */}
            </Panel>
        );
    });

    return (
        <DraggableWindow
            title="CPU性能图"
            visible={visible}
            initialX={0}
            initialY={0}
            width={600}
            height={600}
            id="example_window"
            className={'custom_window'}
            panel_id="flame_graph_container"
        >
            <Panel className="FlameGraphContent" ref={panelRef}>
                {renderFlameGraph()}
                {zoomStack.length > 0 && (
                    <Button
                        className="BackButton"
                        style={{
                            x: '10px',
                            y: '10px',
                            zIndex: 10,
                            backgroundColor: '#333',
                            padding: '5px 20px',
                            borderRadius: '4px',
                            marginBottom: '10px',
                        }}
                        onactivate={() => {
                            setZoomStack(zoomStack.slice(0, -1));
                        }}
                    >
                        <Label style={{ align: 'center center', textAlign: 'center' }} text="返回" />
                    </Button>
                )}
            </Panel>
            <Panel className="FlameGraphFooter">
                <TextEntry
                    className="SearchInput"
                    ref={inputRef}
                    placeholder="搜索函数名..."
                    onblur={panel => setSearchTerm(panel.text)}
                    ontextentrychange={p => {
                        if (p.text == searchTerm) return;
                        SetSearchTextDebounced(p);
                    }}
                />
                <RenderStatusBar></RenderStatusBar>
            </Panel>
        </DraggableWindow>
    );
};
