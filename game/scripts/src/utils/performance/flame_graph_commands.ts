/**
 * 火焰图性能分析命令处理模块
 */

import { GetFlameGraphProfiler } from './flame_graph_profiler';

export class FlameGraphCommands {
    static instance: FlameGraphCommands;
    profiler = GetFlameGraphProfiler();
    recordingState = 0; // 0: 未开始, 1: 开始, 2: 暂停
    recordingTime = 0; // 记录时间（秒）
    timerHandle: string | null = null;

    constructor() {
        this.registerCommands();
        this.registerUIEvents();
        this.updateDebugState();
    }

    /**
     * 获取单例实例
     */
    static getInstance(): FlameGraphCommands {
        if (!FlameGraphCommands.instance) {
            FlameGraphCommands.instance = new FlameGraphCommands();
        }
        return FlameGraphCommands.instance;
    }

    /**
     * 注册聊天命令
     */
    registerCommands(): void {
        ListenToGameEvent('player_chat', event => this.handleChatCommand(event), undefined);
        print('[FlameGraphCommands] 已注册性能分析命令');
    }

    /**
     * 注册UI事件
     */
    registerUIEvents(): void {
        CustomGameEventManager.RegisterListener('performance_start', _ => this.handleStart());
        CustomGameEventManager.RegisterListener('performance_stop', _ => this.handleStop());
        CustomGameEventManager.RegisterListener('performance_paused', _ => this.handlePaused());
        print('[FlameGraphCommands] 已注册性能分析UI事件');
    }

    /**
     * 更新调试状态到网表
     */
    updateDebugState(): void {
        GameRules.XNetTable.SetTableValue('performance_debug', 'debug_state', {
            state: this.recordingState,
            time: this.recordingTime,
        });
    }

    /**
     * 处理开始
     */
    handleStart(): void {
        // 开始记录
        if (this.recordingState === 0) {
            this.startRecording();
        }
    }

    /**
     * 处理停止按钮事件
     */
    handleStop(): void {
        if (this.recordingState === 0) return;
        this.stopRecording();
    }

    /**
     * 处理暂停按钮事件
     */
    handlePaused(): void {
        if (this.recordingState === 1) {
            // 开始 -> 暂停
            this.pauseRecording();
        } else if (this.recordingState === 2) {
            // 暂停 -> 开始
            this.resumeRecording();
        }
    }

    /**
     * 开始记录
     */
    startRecording(): void {
        this.recordingState = 1;
        this.recordingTime = 0;
        this.profiler.startRecording(0); // 持续记录
        // 创建计时器更新记录时间
        this.timerHandle = Timers.CreateTimer(1, () => {
            if (this.recordingState === 1) {
                this.recordingTime++;
                this.updateDebugState();
            }
            return this.recordingState !== 0 ? 1 : null;
        });

        this.updateDebugState();
        print('[FlameGraphProfiler] 开始记录性能数据');
    }

    /**
     * 暂停记录
     */
    pauseRecording(): void {
        this.recordingState = 2;
        this.profiler.pauseRecording();
        this.updateDebugState();
        print('[FlameGraphProfiler] 暂停记录性能数据');
    }

    /**
     * 恢复记录
     */
    resumeRecording(): void {
        this.recordingState = 1;
        this.profiler.resumeRecording();
        this.updateDebugState();
        print('[FlameGraphProfiler] 恢复记录性能数据');
    }

    /**
     * 停止记录
     */
    stopRecording(): void {
        this.recordingState = 0;
        this.profiler.stopRecording();

        if (this.timerHandle) {
            Timers.RemoveTimer(this.timerHandle);
            this.timerHandle = null;
        }

        this.updateDebugState();
        print('[FlameGraphProfiler] 停止记录性能数据');
    }

    /**
     * 处理聊天命令
     */
    handleChatCommand(event: GameEventProvidedProperties & PlayerChatEvent): void {
        const text = event.text;
        const playerID = event.playerid;

        // 只有在工具模式下或者是管理员才能执行命令
        if (!IsInToolsMode() && playerID !== 0) return;

        // 解析命令
        if (text.startsWith('-flamegraph') || text.startsWith('-fg')) {
            const args = text.split(' ');
            const subCommand = args[1];

            switch (subCommand) {
                case 'start':
                    const duration = parseInt(args[2] || '0');
                    this.profiler.startRecording(duration);
                    this.sendMessageToPlayer(playerID, `开始记录性能数据${duration > 0 ? `，持续${duration}秒` : ''}`);
                    break;

                case 'stop':
                    this.profiler.stopRecording();
                    this.sendMessageToPlayer(playerID, '停止记录性能数据');
                    break;

                //持续监听
                case 'dev':
                    this.startRecording();
                    this.sendMessageToPlayer(playerID, `开始持续记录性能数据`);

                case 'help':
                    this.sendHelpMessage(playerID);
                default:
                    this.toggleFlameGraph(playerID);
                    break;
            }
        }
    }

    /**
     * 切换火焰图显示
     * @param playerID 玩家ID
     */
    toggleFlameGraph(playerID: PlayerID): void {
        const player = PlayerResource.GetPlayer(playerID);
        if (!player) return;
        CustomGameEventManager.Send_ServerToPlayer<{}>(player, 'performance_toggle_flamegraph', {});
    }

    /**
     * 发送帮助信息
     */
    sendHelpMessage(playerID: PlayerID): void {
        const message =
            '火焰图性能分析命令:\n' +
            '-flamegraph start [持续时间] - 开始记录性能数据\n' +
            '-flamegraph stop - 停止记录性能数据\n' +
            '-flamegraph export - 导出火焰图数据\n' +
            '-flamegraph help - 显示帮助信息';

        this.sendMessageToPlayer(playerID, message);
    }

    /**
     * 向玩家发送消息
     */
    sendMessageToPlayer(playerID: PlayerID, message: string): void {
        const player = PlayerResource.GetPlayer(playerID);
        if (player) {
            CustomGameEventManager.Send_ServerToPlayer<{ msg: string }>(player, 'game_msg_tip', { msg: message });
        }
    }
}

// 初始化命令处理模块
export function InitFlameGraphCommands(): void {
    FlameGraphCommands.getInstance();
}
