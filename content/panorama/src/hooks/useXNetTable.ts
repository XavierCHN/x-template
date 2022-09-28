import { Dispatch, SetStateAction } from 'react';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import useStateIfMounted from './useStateIfMounted';

export function useXNetTableEvent<
    T extends keyof XNetTableDefinations,
    K extends keyof XNetTableDefinations[T]
>(
    table_name: T,
    key: K,
    callback: (data: XNetTableDefinations[T][K]) => void,
    dependencies: any[] = []
) {
    useLocalEvent(
        `x_net_table`,
        (data) => {
            if (data.table_name.toString() === table_name && data.key.toString() === key) {
                callback(data.content);
                GameUI.CustomUIConfig().__x_nettable_cache__[<string>table_name][<string>key] =
                    data.content;
            }
        },
        [table_name, key, ...dependencies]
    );
}

export function onXNetTableEvent<
    T extends keyof XNetTableDefinations,
    K extends keyof XNetTableDefinations[T]
>(table_name: T, key: K, callback: (data: XNetTableDefinations[T][K]) => void) {
    onLocalEvent(`x_net_table`, (data) => {
        if (data.table_name.toString() === table_name && data.key.toString() === key) {
            callback(data.content);
        }
    });
}

/**
 * 侦听网表变更
 * @export
 * @template T
 * @template K
 * @param {T} table_name 表名
 * @param {K} key 表键
 * @param {XNetTableDefinations[T][K]} fail_safe_value 如果网表中不含有该值，那么返回该值，此项必须是为了避免react渲染出错
 */
export function useNetTableKey<
    T extends keyof XNetTableDefinations,
    K extends keyof XNetTableDefinations[T],
    V = XNetTableDefinations[T][K]
>(table_name: T, key: K, fail_safe_value: V): [V, Dispatch<SetStateAction<V>>] {
    GameUI.CustomUIConfig().__x_nettable_cache__ ??= {};
    GameUI.CustomUIConfig().__x_nettable_cache__[table_name] ??= {};
    let current_value =
        GameUI.CustomUIConfig().__x_nettable_cache__[<string>table_name][<string>key]; // 这个cache的set在dispatcher.ts进行

    const [value, setValue] = useStateIfMounted<V>(current_value ?? fail_safe_value);

    useLocalEvent(`x_net_table`, (data) => {
        if (data.table_name.toString() === table_name && data.key.toString() === key) {
            setValue(data.content);
        }
    });

    return [value, setValue];
}
