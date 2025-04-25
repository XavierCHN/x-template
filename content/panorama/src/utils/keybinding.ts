/**
 * 按键绑定相关工具方法
 */

declare global {
    interface ICustomKeys {
        space: 'SPACE';
    }

    interface CustomUIConfig {
        KeyState: Partial<Record<ICustomKeys[keyof ICustomKeys], boolean>>;
        KeyDownCallback: Partial<Record<ICustomKeys[keyof ICustomKeys], Function>>;
        KeyUpCallback: Partial<Record<ICustomKeys[keyof ICustomKeys], Function>>;
        KeyCallbackID: number;
    }
}

GameUI.CustomUIConfig().KeyState = {};
GameUI.CustomUIConfig().KeyDownCallback = {};
GameUI.CustomUIConfig().KeyUpCallback = {};

export function registerCustomKey(k: ICustomKeys[keyof ICustomKeys]) {
    const c = GameUI.CustomUIConfig();
    const key = k;
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
