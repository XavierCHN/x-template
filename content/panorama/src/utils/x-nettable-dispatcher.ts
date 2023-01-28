import { emitLocalEvent } from './event-bus';
import 'panorama-polyfill-x/lib/console';

(() => {
    GameEvents.Subscribe(`x_net_table`, data => {
        let data_str = data.data;
        // 如果数据不以#开头，那么说明是一次发送过来的
        // 使用JSON.parse解析数据，并dispatch
        if (data_str.charAt(0) != '#') {
            try {
                let data = JSON.parse(data_str) as XNetTableDataJSON;
                dispatch(data.table, data.key, data.value);
            } catch {
                console.warn(`x_net_table dispatch error: ${data_str}`);
            }
        } else {
            // 如果是分割成多次发送的数据
            // 那么将他放到缓存中去，直到数据都接收完毕
            // 如果接收完毕了，那么合并数据再dispatch
            let defs = data_str.split('#');
            let unique_id = defs[1];
            let data_count = parseInt(defs[2]);
            let chunk_index = parseInt(defs[3]);
            // 有时候数据里面可能含有#，那么需要将剩下的数据拼接起来
            let chunk_data = defs.slice(4).join('#');
            GameUI.CustomUIConfig().__x_nettable_chunks_cache__ ??= {};
            GameUI.CustomUIConfig().__x_nettable_chunks_cache__[unique_id] ??= {};
            GameUI.CustomUIConfig().__x_nettable_chunks_cache__[unique_id][chunk_index] = chunk_data;
            if (Object.values(GameUI.CustomUIConfig().__x_nettable_chunks_cache__[unique_id]).length >= data_count) {
                // 将所有的数据按顺序拼接
                let res = Object.entries(GameUI.CustomUIConfig().__x_nettable_chunks_cache__[unique_id])
                    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    .map(v => v[1])
                    .join('');

                try {
                    let data = JSON.parse(res) as XNetTableDataJSON;
                    dispatch(data.table, data.key, data.value);
                } catch {
                    console.warn(`x_net_table dispatch error: ${res}`);
                }
            }
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
 * 比较网表的前值和后值是否一致
 * 如果不一致的话，返回false, 否则返回true
 * TODO，这个比对算法应该还是需要进一步优化的
 *
 * @param {*} prev
 * @param {*} next
 */
export function isEqual(prev: any, next: any): boolean {
    if (typeof prev != typeof next) return false;

    if (typeof prev == 'object') {
        if (prev == null) return next == null;
        if (Array.isArray(prev)) {
            if (prev.length != next.length) return false;
            for (let i = 0; i < prev.length; i++) {
                if (!isEqual(prev[i], next[i])) return false;
            }
        } else {
            for (let key in prev) {
                if (!isEqual(prev[key], next[key])) return false;
            }
        }
    } else {
        return prev == next;
    }

    return true;
}

export function dispatch(table_name: string, key: string, content: any) {
    try {
        GameUI.CustomUIConfig().__x_nettable_cache__ ??= {};
        GameUI.CustomUIConfig().__x_nettable_cache__[table_name] ??= {};
        let prev = GameUI.CustomUIConfig().__x_nettable_cache__[table_name][key];
        if (!isEqual(prev, content)) {
            GameUI.CustomUIConfig().__x_nettable_cache__[table_name][key] = content;
            let table_data = {
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
