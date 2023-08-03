import { reloadable } from '../utils/tstl-utils';

function get_table_size(t: any) {
    // 如果不是table，那么直接返回长度
    if (type(t) !== `table`) {
        return tostring(t).length;
    }
    // 如果是table，那么递归计算尺寸
    let size = 0;
    for (const [k, v] of pairs(t)) {
        size = size + get_table_size(k) + get_table_size(v);
    }
    return size;
}

declare type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

/**
 * A module that uses events to simulate a network table, primarily intended to implement the
 * functionality of Valve's official `CustomNetTables`
 * as described at: https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Custom_Nettables
 * The main purpose is to overcome the 2MB limit of the network table and allow for transmission of larger data sets.
 * It should be noted that sending events takes up server frame time, so for very large data sets
 * they will be split up and sent separately before being reassembled.
 * For small, frequently updated data in-game, it is still recommended to
 * use the native CustomNetTables to avoid affecting network performance.
 *
 * 一个使用事件来模拟网表的模块，其主要目的是为了实现官方的 `CustomNetTables` 的功能
 * 具体见：https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Custom_Nettables
 * 主要目的是为了突破网表的2MB的限制，用以实现更大的数据传输。
 * 需要注意的是，发送事件需要占用服务器帧时间，所以对于特别大的数据将会拆分后发送再组合。
 * 游戏中的小体积高频数据同步，依然推荐使用原生的CustomNetTables，以避免影响网络性能。
 *
 * @export
 * @class XNetTable
 * @license MIT
 */
@reloadable
export class XNetTable {
    constructor() {
        print(`[XNetTable] Activated`);
        this._startHeartbeat();
        // 注册事件监听
        ListenToGameEvent(`player_connect_full`, keys => this._onPlayerConnectFull(keys), this);
    }

    Reload() {
        print(`[XNetTable] Reloaded`);
    }

    // 最大传输单元，这个其实取决于服务器的带宽，不建议太大
    // 经过测试，比较好的数值是12KB
    private MTU = 1024 * 12;

    // 所有玩家都共享的数据
    private _data: PartialRecord<string, PartialRecord<string, any>> = {};
    // 某个玩家单独的数据，这个数据互相之间是保密的，不会发送到其他玩家的客户端
    private _player_data: PartialRecord<PlayerID, PartialRecord<string, PartialRecord<string, any>>> = {};

    // 数据队列，用来存储所有待发送的数据
    private _data_queue: {
        target?: PlayerID;
        data_length: number;
        data:
            | string // 要么是以字符串形式发送的数据块
            | XNetTableObject; // 要么是一次性发送的数据
    }[] = [];

    /**
     * 设置所有玩家共享的数据
     *
     * @param {TName} tname
     * @param {TKey} key
     * @param {T[TKey]} value
     * @return {*}
     * @memberof XNetTable
     */
    SetTableValue<TName extends keyof XNetTableDefinitions, TStruct extends XNetTableDefinitions[TName], TKey extends keyof TStruct>(
        tname: TName,
        key: TKey,
        value: TStruct[TKey]
    ): void {
        if (!IsServer()) return;
        const key_name = tostring(key);
        this._data[tname] ??= {};
        value = value ?? ({} as TStruct[TKey]);
        this._data[tname][key_name] = value;
        // @ts-expect-error
        this._appendUpdateRequest(undefined, tname, key_name, value);
    }

    /**
     * 设置某个玩家单独的数据
     *
     * @param {PlayerID} playerId
     * @param {TName} tname
     * @param {TKey} key
     * @param {T[TKey]} value
     * @return {*}
     * @memberof XNetTable
     */
    SetPlayerTableValue<TName extends keyof XNetTableDefinitions, TStruct extends XNetTableDefinitions[TName], TKey extends keyof TStruct>(
        playerId: PlayerID,
        tname: TName,
        key: TKey,
        value: TStruct[TKey]
    ): void {
        if (!IsServer()) return;

        const key_name = tostring(key);
        this._player_data[playerId] ??= {};
        this._player_data[playerId]![tname] ??= {};
        value = value ?? ({} as TStruct[TKey]);
        this._player_data[playerId]![tname][key_name] = value;
        // @ts-expect-error
        this._appendUpdateRequest(playerId, tname, key_name, value);
    }

    /**
     * 某个表的更新时间记录，用以判断某个网表是否同一帧内更新了多次
     *
     * @private
     * @type {Record<string, number>}
     * @memberof XNetTable
     */
    private _last_update_time_mark: Record<string, number> = {};

    /**
     * 添加一个更新请求，对于比较小的更新请求直接发送，对于比较大的更新请求
     * 则使用json序列化后，再分割成MTU的大小发送
     * 如果是同一帧内多次更新，那么会报错
     *
     * @private
     * @param {(PlayerID | undefined)} playerId
     * @param {TName} tname
     * @param {TKey} key
     * @param {T[TKey]} value
     * @memberof XNetTable
     */
    private _appendUpdateRequest<TName extends keyof XNetTableDefinitions, TStruct extends XNetTableDefinitions[TName], TKey extends keyof TStruct>(
        playerId: PlayerID | undefined,
        tname: TName,
        key: TKey,
        value: TStruct[TKey]
    ) {
        const k = tostring(key);

        // 判断value的大小，如果过小，那么直接使用object发送
        // 如果过大，那么拆分之后使用字符串分割发送
        const size = get_table_size(value);

        // 判断是否一帧执行了多次更新，如果是，那么报错要求用户优化代码
        const mark_name = `${playerId ?? 'all'}.${tname}.${k}`;
        const now = GameRules.GetGameTime();
        const last_update_time = this._last_update_time_mark[mark_name] ?? 0;
        if (now == last_update_time) {
            print(`[XNetTable] ${mark_name}同一帧执行了多次更新，建议优化代码，一帧最多只更新一次，本次更新照常执行`);
        }
        this._last_update_time_mark[mark_name] = now;

        // @TODO, 判断value的数据类型，如果是一个哈希表，那么需要进行特殊处理
        // 避免使用官方的事件直接发送的结果和JSON序列化后再反序列化之后的结果不一致
        // @fixme

        // 如果数据太小，直接推入发送队列
        if (size < this.MTU) {
            this._data_queue.push({
                target: playerId,
                data_length: size,
                data: {
                    table_name: tname,
                    key: k,
                    content: value,
                },
            });
        } else {
            // 如果数据过大，那么拆分成块之后再推入发送队列
            const data = this._prepareDataChunks(tname, k, value);
            for (let i = 0; i < data.length; i++) {
                this._insertDataToQueue(data[i], playerId);
            }
        }
    }

    private _insertDataToQueue(data: string | XNetTableObject, playerId?: PlayerID, positively?: boolean) {
        const size = get_table_size(data);
        // 一般是先发先到，但是如果是消极的推送，那么就是后发先到
        if (positively) {
            // 如果你有使用抢占式更新的需求，那么可以自己改造这个类来实现
            this._data_queue.unshift({
                target: playerId,
                data_length: size,
                data: data,
            });
        } else {
            // 默认只使用这个推送到队列尾部的方式
            this._data_queue.push({
                target: playerId,
                data_length: size,
                data: data,
            });
        }
    }

    private _prepareDataChunks(tname: string, key: string, value?: any): string[] {
        // 将数据json化之后分割成小块来准备发送
        const data = this._encodeTable({
            table: tname,
            key,
            value,
        });
        const chunks: string[] = [];
        const chunk_size = this.MTU - 2;

        // 如果数据需要分割，那么他们将会拥有同样的unique_id
        // 另外会有第二个参数（index），用来标记这个数据是第几个chunk
        // 第三个参数则是这个chunk的大小
        const unique_id = DoUniqueString('');
        const data_length = string.len(data);

        if (data_length > chunk_size) {
            const chunk_count = Math.ceil(data_length / chunk_size);
            for (let i = 0; i < chunk_count; i++) {
                let chunk = data.substring(i * chunk_size, (i + 1) * chunk_size);
                print(string.len(chunk));
                // 如果是分割后的数据，那么会有#作为头部标记
                // 数据格式 #unique_id#chunk_count#index#chunk
                chunk = `#${unique_id}#${chunk_count}#${i}#${chunk}`;
                chunks.push(chunk);
            }
        }
        // 如果数据长度OK的话，那么不需要分割
        else {
            chunks.push(data);
        }
        return chunks;
    }

    private _encodeTable(t: XNetTableDataJSON): string {
        return json.encode(t);
    }

    // 监听玩家的重新连接事件
    // 如果有玩家重连，那么把所有需要发送给他的数据都再发一遍给他
    private _onPlayerConnectFull(keys: GameEventProvidedProperties & GameEventDeclarations[`player_connect_full`]) {
        const playerId = keys.PlayerID;
        const player = PlayerResource.GetPlayer(playerId);
        if (player == null) return;

        // 发送所有的全局共享数据
        for (const tname in this._data) {
            for (const key in this._data[tname]) {
                // @ts-expect-error
                this._appendUpdateRequest(playerId, tname, key, this._data[tname][key]);
            }
        }
        // 发送所有这个玩家独享的数据
        if (this._player_data[playerId] == null) return;
        for (const tname in this._player_data[playerId]) {
            const table = this._player_data[playerId]![tname];
            if (table == null) continue;
            for (const key in table) {
                // @ts-expect-error
                this._appendUpdateRequest(playerId, tname, key, table[key]);
            }
        }
    }

    private _startHeartbeat() {
        Timers.CreateTimer(() => {
            let data_sent_length = 0;

            while (this._data_queue.length > 0) {
                if (data_sent_length > this.MTU) {
                    // print(`[x_net_table]当前帧发送数据量${data_sent_length},剩余${this._data_queue.length}条数据未发送，留到下一帧执行`);
                    return FrameTime();
                }

                const data = this._data_queue.shift();
                if (data == null) {
                    // print(`数据已经发完了，进入等待状态`);
                    return FrameTime();
                }

                const content = data.data;
                const content_length = data.data_length;
                const target = data.target;
                data_sent_length += content_length;

                // -1或者为null代表发送到所有客户端
                if (target == null || target == -1) {
                    // print(`给全体玩家发送数据${data_str}`);
                    CustomGameEventManager.Send_ServerToAllClients(`x_net_table`, {
                        data: content,
                    });
                }
                // 否则发送给对应玩家
                else {
                    // print(`给玩家${data.target}发送数据${data_str}`);
                    const player = PlayerResource.GetPlayer(target);

                    // 只有当玩家存在的时候才发给他
                    if (player != null && !player.IsNull()) {
                        CustomGameEventManager.Send_ServerToPlayer(player, `x_net_table`, {
                            data: content,
                        });
                    }
                }
            }

            return FrameTime();
        });
    }
}
