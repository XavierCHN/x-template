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
        const strs = keys.text.split(' ');
        const cmd = strs[0];
        const args = strs.slice(1);
        const steamid = PlayerResource.GetSteamAccountID(keys.playerid);

        if (cmd === '-debug') {
            if (this.OnlineDebugWhiteList.includes(steamid)) {
                this.DebugEnabled = !this.DebugEnabled;
            }
        }

        // 只在允许调试的时候才执行以下指令
        // commands that only work in debug mode below:
        if (!this.DebugEnabled) return;

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
