/**
 * 创建任意自定义按键回调
 * 在react中使用时请注意只在useEffect等hook中使用
 */

declare global {
    interface CustomUIConfig {
        KeyDownCallbacks: { [key: string]: { [funcName: string]: () => void } };
        KeyUpCallbacks: { [key: string]: { [funcName: string]: () => void } };
        RegisterKeyBind: typeof registerKeyBind;
    }
}

function GetCommandName(name: string) {
    return `key${name}${Date.now()}`;
}

function GetKeyBind(name: string) {
    const contextPanel = $.GetContextPanel();
    $.CreatePanel('DOTAHotkey', contextPanel, '', { keybind: name });
    var keyElement = contextPanel.GetChild(contextPanel.GetChildCount() - 1)!;
    keyElement.DeleteAsync(0);
    const keybind = (keyElement.GetChild(0)! as LabelPanel).text;
    console.log(`get custom key bind for ${name} => ${keybind}`);
    return keybind;
}

function RegisterKeyBindHandler(name: string) {
    const keydownCallbacks = GameUI.CustomUIConfig().KeyDownCallbacks ?? {};
    const keyupCallbacks = GameUI.CustomUIConfig().KeyUpCallbacks ?? {};
    const commandName = GetCommandName(name);
    Game.AddCommand(
        `+${commandName}`,
        () => {
            for (const key in keydownCallbacks[name] ?? []) {
                keydownCallbacks[name][key]();
            }
        },
        '',
        1 << 32
    );
    Game.AddCommand(
        `-${commandName}`,
        () => {
            for (const key in keyupCallbacks[name] ?? []) {
                keyupCallbacks[name][key]();
            }
        },
        '',
        1 << 32
    );
    return commandName;
}

export function registerKeyBind(name: string, onKeyDown?: () => void, onKeyUp?: () => void) {
    const keydownCallbacks = GameUI.CustomUIConfig().KeyDownCallbacks ?? {};
    const keyupCakkbacks = GameUI.CustomUIConfig().KeyUpCallbacks ?? {};
    if (keydownCallbacks[name] == null) {
        const commandName = RegisterKeyBindHandler(name);
        const key = GetKeyBind(name);
        if (key !== '') {
            Game.CreateCustomKeyBind(key, commandName);
        }
    }
    if (onKeyDown) {
        keydownCallbacks[name][onKeyDown.name] = onKeyDown;
    }
    if (onKeyUp) {
        keyupCakkbacks[name][onKeyUp.name] = onKeyUp;
    }
}

GameUI.CustomUIConfig().RegisterKeyBind = registerKeyBind;
