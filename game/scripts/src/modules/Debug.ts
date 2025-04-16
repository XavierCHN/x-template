import { reloadable } from '../utils/tstl-utils';
import { InitFlameGraphCommands } from '../utils/performance/flame_graph_commands';
import { ProfileClass, Profile } from '../utils/performance/flame_graph_profiler';

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

        // 注册聊天指令
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
        if (cmd === 'test') {
            this.Test();
        }
        if (cmd === 'test2') {
            //初始化Cpu性能检测
            InitFlameGraphCommands();
            // 注册测试类
            new Debug_Test();
            print('初始化完成');
        }
        if (cmd === '-r') {
            SendToConsole('clear'); // 清空控制台
            SendToConsole('restart'); // 重启游戏
            print('-r 命令restart重启游戏!');
        }
        if (cmd === '-s') {
            SendToConsole('script_reload');
            print('-r 命令script_reload!重载脚本!');
        }
    }

    //检测指定函数
    @Profile()
    Test() {
        for (let i = 0; i < 100000; i++) {
            math.random(0, 10000);
        }
    }
}

//检测类
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

    Test() {
        for (let i = 0; i < 10000; i++) {
            math.random(0, 10000);
            math.random(0, 10000);
            // math.random(0, 10000);
            // math.random(0, 10000);
        }
    }

    Test2() {
        math.random(0, 10000);
        math.random(0, 10000);
        // math.random(0, 10000);
        // math.random(0, 10000);
    }
}
