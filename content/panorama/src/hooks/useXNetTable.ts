import { Dispatch, SetStateAction } from 'react';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import useStateIfMounted from './useStateIfMounted';

export function onXNetTable<
    T extends keyof XNetTableDefinations,
    K extends keyof XNetTableDefinations[T]
>(table_name: T, key: K, callback: (data: XNetTableDefinations[T][K]) => void) {
    GameUI.CustomUIConfig().__x_nettable_cache__ ??= {};
    GameUI.CustomUIConfig().__x_nettable_cache__[table_name] ??= {};
    //@ts-expect-error
    let value = GameUI.CustomUIConfig().__x_nettable_cache__[table_name][key];

    if (value != null) {
        callback(value);
    }

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
    //@ts-expect-error
    let current_value = GameUI.CustomUIConfig().__x_nettable_cache__[table_name][key];

    const [value, setValue] = useStateIfMounted<V>(current_value ?? fail_safe_value);

    useLocalEvent(`x_net_table`, (data) => {
        if (data.table_name.toString() === table_name && data.key.toString() === key) {
            setValue(data.content);
        }
    });

    return [value, setValue];
}

export function onPlayerXNetTable<
    T extends keyof PlayerXNetTableDefinations,
    K extends keyof PlayerXNetTableDefinations[T],
    V extends PlayerXNetTableDefinations[T][K]
>(table_name: T, key: K, callback: (data: V) => void) {
    GameUI.CustomUIConfig().__x_nettable_cache__ ??= {};
    GameUI.CustomUIConfig().__x_nettable_cache__[table_name] ??= {};
    //@ts-expect-error
    let value = GameUI.CustomUIConfig().__x_nettable_cache__[table_name][key];

    if (value != null) {
        callback(value);
    }

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
 * @template V
 * @param {T} table_name 表名
 * @param {K} key 表键
 * @param {V} fail_safe_value 如果网表中不含有该值，那么返回该值，此项必须是为了避免react渲染出错
 */
export function usePlayerXNetTableKey<
    T extends keyof PlayerXNetTableDefinations,
    K extends keyof PlayerXNetTableDefinations[T],
    V extends PlayerXNetTableDefinations[T][K]
>(
    table_name: T,
    key: K,
    fail_safe_value: V,
    playerId: PlayerID = Game.GetLocalPlayerID()
): [V, Dispatch<SetStateAction<V>>] {
    let playerKey = `${key.toString()}${playerId}`;
    GameUI.CustomUIConfig().__x_nettable_cache__ ??= {};
    GameUI.CustomUIConfig().__x_nettable_cache__[table_name] ??= {};
    let current_value = GameUI.CustomUIConfig().__x_nettable_cache__[table_name][playerKey];

    const [value, setValue] = useStateIfMounted<V>(current_value ?? fail_safe_value);

    useLocalEvent(
        `x_net_table`,
        (data) => {
            if (data.table_name.toString() === table_name && data.key.toString() === playerKey) {
                setValue(data.content);
            }
        },
        []
    );

    return [value, setValue];
}
