import { reloadable } from '../utils/tstl-utils';

@reloadable
export class Debug {
    DebugEnabled = false;
    // 在线测试白名单
    OnlineDebugWhiteList = [
        86815341, // Xavier
    ];
    constructor() {
        // 工具模式下开启调试
        this.DebugEnabled = IsInToolsMode();
        ListenToGameEvent(`player_chat`, keys => this.OnPlayerChat(keys), this);
    }
    OnPlayerChat(keys: GameEventProvidedProperties & PlayerChatEvent): void {
        if (!this.DebugEnabled) return; // 只在测试模式下启动
        let strs = keys.text.split(' ');
        let cmd = strs[0];
        let args = strs.slice(1);
        let steamid = PlayerResource.GetSteamAccountID(keys.playerid);

        if (cmd === '-debug') {
            if (this.OnlineDebugWhiteList.includes(steamid)) {
                this.DebugEnabled = !this.DebugEnabled;
            }
        }
    }
}
