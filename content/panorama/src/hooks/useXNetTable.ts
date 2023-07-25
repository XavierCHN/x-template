import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { LocalEvent } from '../def/local_event_def';
import { onLocalEvent, useLocalEvent } from '../utils/event-bus';
import useStateIfMounted from './useStateIfMounted';

/**
 * 类似于useGameEvent，但是他的数据会被缓存
 *
 * 要注意，这个hook的callback参数需要保持一致，否则事件会被重复注册
 * 最好使用 React.useCallback 包裹
 *
 * @export
 * @template T
 * @template K
 * @param {T} table_name
 * @param {K} key
 * @param {(data: XNetTableDefinitions[T][K]) => void} callback
 */
export function useXNetTableEvent<TABLE_NAME extends keyof XNetTableDefinitions, T extends XNetTableDefinitions[TABLE_NAME], KEY extends keyof T>(
    table_name: TABLE_NAME,
    key: KEY,
    callback: (data: T[KEY]) => void
) {
    const _callback = React.useCallback(
        (data: LocalEvent['x_net_table']) => {
            if (data.table_name.toString() === table_name && data.key.toString() === key) {
                callback(data.content);
                GameUI.CustomUIConfig().__x_nettable_cache__[<string>table_name][<string>key] = data.content;
            }
        },
        [callback, key, table_name]
    );
    useLocalEvent(`x_net_table`, _callback);
}

/**
 * 当x_net_table中的数据发生变化时，会触发回调
 *
 * 注意： *这不是一个hook函数，不要在函数组件中使用*
 *
 * @export
 * @template T
 * @template K
 * @param {T} table_name
 * @param {K} key
 * @param {(data: XNetTableDefinitions[T][K]) => void} callback
 */
export function onXNetTableEvent<TABLE_NAME extends keyof XNetTableDefinitions, T extends XNetTableDefinitions[TABLE_NAME], KEY extends keyof T>(
    table_name: TABLE_NAME,
    key: KEY,
    callback: (data: T[KEY]) => void
) {
    onLocalEvent(`x_net_table`, data => {
        if (data.table_name.toString() === table_name && data.key.toString() === key) {
            callback(data.content);
        }
    });
}

/**
 * 侦听网表变更的hook回调
 * @export
 * @template T
 * @template KEY
 * @param {T} table_name 表名
 * @param {KEY} key 表键
 * @param {XNetTableDefinitions[T][KEY]} fail_safe_value 如果网表中不含有该值，那么返回该值，此项必须是为了避免react渲染出错
 */
export function useXNetTableKey<TABLE_NAME extends keyof XNetTableDefinitions, T extends XNetTableDefinitions[TABLE_NAME], KEY extends keyof T>(
    table_name: TABLE_NAME,
    key: KEY,
    fail_safe_value: T[KEY]
): T[KEY] {
    GameUI.CustomUIConfig().__x_nettable_cache__ ??= {};
    GameUI.CustomUIConfig().__x_nettable_cache__[table_name] ??= {};
    const current_value = GameUI.CustomUIConfig().__x_nettable_cache__[<string>table_name][<string>key]; // 这个cache的set在dispatcher.ts进行

    const [value, setValue] = useStateIfMounted<T[KEY]>(current_value ?? fail_safe_value);

    const callback = React.useCallback(
        data => {
            if (data.table_name.toString() === table_name && data.key.toString() === key) {
                setValue(data.content);
            }
        },
        [table_name, key, setValue]
    );

    useLocalEvent(`x_net_table`, callback);

    return value;
}
