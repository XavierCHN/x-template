import { emitLocalEvent } from './event-bus';
import 'panorama-polyfill-x/lib/console';

// 定义 XNetTableDataJSON 类型
interface XNetTableDataJSON {
    table: string;
    key: string;
    value: any;
}

// 获取 CustomUIConfig
function getCustomUIConfig() {
    return GameUI.CustomUIConfig();
}

// 处理非字符串数据
function handleNonStringData(content: any) {
    if (content.table_name != null) {
        dispatch(content.table_name, content.key, content.content);
    } else {
        throw new Error(`x_net_table data type error: ${typeof content}`);
    }
}

// 处理字符串数据
function handleStringData(content: string) {
    if (content.charAt(0) !== '#') {
        parseAndDispatch(content);
    } else {
        handleChunkedData(content);
    }
}

// 解析并分发数据
function parseAndDispatch(content: string) {
    try {
        const _table_object = JSON.parse(content) as XNetTableDataJSON;
        dispatch(_table_object.table, _table_object.key, _table_object.value);
    } catch {
        console.warn(`x_net_table dispatch error: ${content}`);
    }
}

// 处理分块数据
function handleChunkedData(content: string) {
    const defs = content.split('#');
    const unique_id = defs[1];
    const data_count = parseInt(defs[2]);
    const chunk_index = parseInt(defs[3]);
    const chunk_data = defs.slice(4).join('#');

    const config = getCustomUIConfig();
    config.__x_nettable_chunks_cache__ ??= {};
    config.__x_nettable_chunks_cache__[unique_id] ??= {};
    config.__x_nettable_chunks_cache__[unique_id][chunk_index] = chunk_data;

    if (Object.values(config.__x_nettable_chunks_cache__[unique_id]).length >= data_count) {
        const res = Object.entries(config.__x_nettable_chunks_cache__[unique_id])
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(v => v[1])
            .join('');

        parseAndDispatch(res);
    }
}

(() => {
    GameEvents.Subscribe(`x_net_table`, received_object => {
        const content = received_object.data;

        if (typeof content !== 'string') {
            handleNonStringData(content);
        } else {
            handleStringData(content);
        }
    });
})();

declare global {
    interface CustomUIConfig {
        // 数据缓存
        __x_nettable_cache__: {
            [table: string]: {
                [key: string]: any;
            };
        };
        // 数据碎片缓存
        __x_nettable_chunks_cache__: {
            [unique_id: string]: {
                [index: number]: string;
            };
        };
    }
}

/**
 * 比较两个值是否深度相等
 * 支持基本类型、对象、数组、Map 和 Set，同时处理循环引用
 *
 * @param prev 前一个值
 * @param next 后一个值
 * @param visited 用于记录已经访问过的对象，避免循环引用
 */
export function isEqual(prev: any, next: any, visited = new WeakMap()): boolean {
    // 处理基本类型和 null
    if (prev === next) return true;
    if (typeof prev !== 'object' || prev === null || typeof next !== 'object' || next === null) {
        return prev === next;
    }

    // 处理循环引用
    if (visited.has(prev)) {
        return visited.get(prev) === next;
    }
    visited.set(prev, next);

    // 处理数组
    if (Array.isArray(prev)) {
        if (!Array.isArray(next) || prev.length !== next.length) return false;
        for (let i = 0; i < prev.length; i++) {
            if (!isEqual(prev[i], next[i], visited)) return false;
        }
        return true;
    }

    // 处理普通对象
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    if (prevKeys.length !== nextKeys.length) return false;
    for (const key of prevKeys) {
        if (!next.hasOwnProperty(key) || !isEqual(prev[key], next[key], visited)) return false;
    }

    return true;
}

export function dispatch(table_name: string, key: string, content: any) {
    try {
        const config = getCustomUIConfig();
        config.__x_nettable_cache__ ??= {};
        config.__x_nettable_cache__[table_name] ??= {};
        const prev = config.__x_nettable_cache__[table_name][key];
        if (!isEqual(prev, content)) {
            config.__x_nettable_cache__[table_name][key] = content;
            const table_data = {
                table_name,
                key,
                content,
            };
            // console.log(`x net table data updated ${table_name}->${key}`);
            emitLocalEvent(`x_net_table`, table_data);
        }
    } catch (error) {
        console.log(`x_net_table dispatch error: ${table_name} -> ${key} -> ${content}`);
    }
}
