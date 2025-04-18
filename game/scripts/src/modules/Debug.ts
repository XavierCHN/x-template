import { reloadable } from '../utils/tstl-utils';

import { FlameGraphProfilerTests } from '../utils/performance/flame_graph_profiler_test';

@reloadable
export class Debug {
    DebugEnabled = false;
    private _chatListener: EventListenerID;

    // 在线测试白名单
    OnlineDebugWhiteList = [
        86815341, // Xavier
    ];

    constructor() {
        // 工具模式下开启调试
        if (IsInToolsMode()) {
            this._toggleDebugMode(true);
        }
    }

    private _toggleDebugMode(on?: boolean) {
        if (on === undefined) {
            this.DebugEnabled = !this.DebugEnabled;
        }
        if (this.DebugEnabled) {
            print('Debug mode enabled!');
            new FlameGraphProfilerTests();
            this._chatListener = ListenToGameEvent(`player_chat`, keys => this.OnPlayerChat(keys), this);
        } else {
            print('Debug mode disabled!');
            if (this._chatListener) {
                StopListeningToGameEvent(this._chatListener);
                this._chatListener = undefined;
            }
        }
    }

    OnPlayerChat(keys: GameEventProvidedProperties & PlayerChatEvent): void {
        const strs = keys.text.split(' ');
        const cmd = strs[0];
        const args = strs.slice(1);
        const steamid = PlayerResource.GetSteamAccountID(keys.playerid);

        if (cmd === '-debug') {
            if (this.OnlineDebugWhiteList.includes(steamid)) {
                this._toggleDebugMode();
            }
        }

        // 只在允许调试的时候才执行以下指令
        // commands that only work in debug mode below:
        if (!this.DebugEnabled) return;

        if (cmd === '-r') {
            SendToConsole('restart'); // 重启游戏
            print('-r 命令restart重启游戏!');
        }

        if (cmd === '-s') {
            SendToConsole('script_reload');
            print('-r 命令script_reload!重载脚本!');
        }

        // 其他的测试指令写在下面
        if (cmd === 'get_key_v3') {
            const version = args[0];
            const key = GetDedicatedServerKeyV3(version);
            Say(HeroList.GetHero(0), `${version}: ${key}`, true);
        }

        if (cmd === 'get_key_v2') {
            const version = args[0];
            const key = GetDedicatedServerKeyV2(version);
            Say(HeroList.GetHero(0), `${version}: ${key}`, true);
        }
    }
}
