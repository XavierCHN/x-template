import 'panorama-polyfill-x/lib/timers';
import { useEffect, useState } from 'react';

/**
 * 获取是否按下了alt键
 *
 * @export
 * @return {*}  {(boolean | undefined)}
 */
export function useAltKeyDown(): boolean | undefined {
    const [alt, setAlt] = useState(GameUI.IsAltDown());
    useEffect(() => {
        const i = setInterval(() => {
            setAlt(GameUI.IsAltDown());
            return 0.1;
        }, 0.1);
        return () => clearInterval(i);
    }, []);
    return alt;
}

/**
 * 设置某个自定义键的回调函数
 *
 * @export
 * @param {string} keyName
 * @param {Function} callback
 */
export function setKeyDownCallback(keyName: string, callback: Function) {
    const c = GameUI.CustomUIConfig();
    c.KeyDownCallback[keyName] = callback;
}

/**
 * 设置某个按键弹起时候触发的自定义函数
 * @export
 * @param {CustomKeys} keyName
 * @param {Function} callback
 */
export function setKeyUpCallback(keyName: string, callback: Function) {
    const c = GameUI.CustomUIConfig();
    c.KeyUpCallback[keyName] = callback;
}

/**
 * 按下某个键，按下的时候触发回调
 * 记得使用 React.useCallback 包裹回调函数
 *
 * @export
 * @param {CustomKeys} keyName
 * @param {Function} callback
 */
export function useKeyDown(keyName: string, callback: Function) {
    useEffect(() => {
        setKeyDownCallback(keyName, () => {
            callback();
        });
        return () => {
            setKeyDownCallback(keyName, () => {});
        };
    }, [keyName, callback]);
}

/**
 * 按下某个键，松开的时候触发回调
 * 记得使用 React.useCallback 包裹回调函数
 *
 * @export
 * @param {string} keyName
 * @param {Function} callback
 */
export function useKeyUp(keyName: string, callback: Function): void {
    useEffect(() => {
        setKeyUpCallback(keyName, () => {
            callback();
        });
        return () => {
            setKeyUpCallback(keyName, () => {});
        };
    }, [keyName, callback]);
}

/**
 * 按住某个键，用以改变状态
 * @export
 * @param {CustomKeys} keyName
 * @return {*}  {(boolean | undefined)}
 */
export function useKeyPressed(keyName: string): boolean | undefined {
    const [keyDown, setKeyDown] = useState(GameUI.CustomUIConfig().KeyState[keyName]);
    useEffect(() => {
        const i = setInterval(() => {
            setKeyDown(GameUI.CustomUIConfig().KeyState[keyName]);
            return 0.1;
        }, 0.1);
        return () => clearInterval(i);
    }, [keyName, setKeyDown]);
    return keyDown;
}
