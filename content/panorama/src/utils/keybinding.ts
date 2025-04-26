/**
 * 按键绑定相关工具方法
 */

declare global {
    interface CustomUIConfig {
        KeyState: Partial<Record<string, boolean>>;
        KeyDownCallback: Partial<Record<string, Function>>;
        KeyUpCallback: Partial<Record<string, Function>>;
        KeyCallbackID: number;
    }
}

GameUI.CustomUIConfig().KeyState = {};
GameUI.CustomUIConfig().KeyDownCallback = {};
GameUI.CustomUIConfig().KeyUpCallback = {};

export function registerCustomKey(keyName: string) {
    const c = GameUI.CustomUIConfig();
    const key = keyName;
    const command = `On${key}${Date.now()}`;
    Game.CreateCustomKeyBind(key, `+${command}`);
    Game.AddCommand(
        `+${command}`,
        () => {
            c.KeyState[key] = true;
            if (c.KeyDownCallback[key] != null) {
                c.KeyDownCallback[key]!();
            }
        },
        ``,
        1 << 32
    );
    Game.AddCommand(
        `-${command}`,
        () => {
            c.KeyState[key] = false;
            if (c.KeyUpCallback[key] != null) {
                c.KeyUpCallback[key]!();
            }
        },
        ``,
        1 << 32
    );
}
