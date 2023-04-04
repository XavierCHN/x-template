import { reloadable } from '../utils/tstl-utils';

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
    private MTU = 2048;
    // 所有玩家都共享的数据
    private _data: Record<string, Record<string, any>> = {};
    // 某个玩家单独的数据，这个数据互相之间是保密的，不会发送到其他玩家的客户端
    private _player_data: Partial<Record<PlayerID, Record<string, Record<string, any>>>> = {};
    // 数据队列，用来存储数据发送的队列
    private _data_queue: {
        target?: PlayerID;
        data: string;
    }[] = [];

    /**
     * 设置网表数据
     * 这个数据是共享的，所有玩家都看得到
     *
     * @template TName
     * @param {TName} tname 表名，需要在 x-net-table.ts 的 `XNetTableDefinations` 里面定义
     * @param {XNetTableDefinations[TName]} value 表的数值
     * @returns
     * @memberof XNetTable
     */
    SetTableValue<TName extends keyof XNetTableDefinations, T extends XNetTableDefinations[TName], K extends keyof T>(
        tname: TName,
        key: K,
        value: T[K]
    ) {
        if (!IsServer()) return;

        let k = tostring(key);
        this._data[tname] ??= {};
        if (value == null) {
            this._data[tname][k] = {};
            let data = this._prepareDataChunks(tname, k, {});
            this._updatePositively(undefined, data);
        } else {
            this._data[tname][k] = value;
            let data = this._prepareDataChunks(tname, k, value);
            this._updatePositively(undefined, data);
        }
    }

    /**
     * 设置某个玩家的数据，这个数据对于其他玩家是保密的，不会发送到他们的客户端
     *
     * 数据将会被放入更新队列中，默认会放到队列头，也就是会被立马发送出去
     * 这样时效性最佳，如果有什么太长的数据，那他会被延迟发送
     *
     * @description 设置表数据(server only)
     * @author XavierCHN
     * @template TName
     * @template T
     * @template K
     * @param {TName} tname 表名
     * @param {K} key 键值
     * @param {T[K]} value 数据
     * @return {*} {void}
     * @memberof XNetTable
     */
    SetPlayerTableValue<TName extends keyof XNetTableDefinations, T extends XNetTableDefinations[TName], K extends keyof T>(
        playerId: PlayerID,
        tname: TName,
        key: K,
        value: T[K]
    ) {
        if (!IsServer()) return;

        let k = tostring(key);
        this._player_data[playerId] ??= {};
        this._player_data[playerId]![tname] ??= {};

        if (value == null) {
            this._player_data[playerId]![tname][k] = {};
            let data = this._prepareDataChunks(tname, k, null, playerId);
            this._updatePositively(playerId, data);
        } else {
            this._player_data[playerId]![tname][k] = value;
            let data = this._prepareDataChunks(tname, k, value, playerId);
            this._updatePositively(playerId, data);
        }
    }

    /** 用来记录每个网表上次更新时间的map */
    private _lastUpdateTimeMarks: Record<string, number> = {};

    /**
     * 处理网表数据，目前只是简单做json
     * 目前并没有做自动转换数据类型的操作，比如将entity转换为entity index等
     * 发送之前要自己做处理
     *
     * @private
     * @param {string} tname
     * @param {string} key
     * @param {*} [value]
     * @param {PlayerID} [playerId]
     * @returns {string[]}
     * @memberof XNetTable
     */
    private _prepareDataChunks(tname: string, key: string, value?: any, playerId?: PlayerID): string[] {
        // 如果某个同样的数据被短时间内更新太多次（一帧内超过1次），那么弹出一个警告，要求玩家优化代码
        const tkv = `${tname}.${key}.${playerId ?? 'all'}`;
        const now = GameRules.GetGameTime();
        if (this._lastUpdateTimeMarks[tkv] == now) {
            print(`[XNetTable] Warning: ${tkv} updated too many times in one frame!`);
        }
        this._lastUpdateTimeMarks[tkv] = now;

        let data = json.encode({
            table: tname,
            key: key,
            value: value,
        });
        let chunks: string[] = [];
        let chunk_size = this.MTU - 2;

        // 如果数据需要分割，那么他们将会拥有同样的unique_id
        // 另外会有第二个参数（index），用来标记这个数据是第几个chunk
        // 第三个参数则是这个chunk的大小
        let unique_id = DoUniqueString('');
        let data_length = string.len(data);

        // 如果数据过长，那么将他分割成小块再发送，避免因为一次发送数据过大的事件导致卡顿
        if (data_length > chunk_size) {
            let chunk_count = Math.ceil(data_length / chunk_size);
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

    private _updatePositively(target: PlayerID | undefined, chunks: string[]) {
        for (let chunk of chunks.reverse()) {
            this._data_queue.unshift({
                target: target,
                data: chunk,
            });
        }
    }

    private _updateNegatively(target: PlayerID | undefined, chunks: string[]) {
        for (let chunk of chunks) {
            this._data_queue.push({
                target: target,
                data: chunk,
            });
        }
    }

    // 监听玩家的重新连接事件
    // 如果有玩家重连，那么把所有需要发送给他的数据都再发一遍给他
    private _onPlayerConnectFull(keys: GameEventProvidedProperties & GameEventDeclarations[`player_connect_full`]) {
        let playerId = keys.PlayerID;
        let player = PlayerResource.GetPlayer(playerId);
        if (player == null) return;

        // 发送所有的全局共享数据
        for (let tname in this._data) {
            for (let key in this._data[tname]) {
                let data = this._prepareDataChunks(tname, key, this._data[tname][key], playerId);
                this._updateNegatively(playerId, data);
            }
        }
        // 发送所有这个玩家独享的数据
        if (this._player_data[playerId] == null) return;
        for (let tname in this._player_data[playerId]) {
            let table = this._player_data[playerId]![tname];
            if (table == null) continue;
            for (let key in table) {
                let data = this._prepareDataChunks(tname, key, table[key], playerId);
                this._updateNegatively(playerId, data);
            }
        }
    }

    private _startHeartbeat() {
        Timers.CreateTimer(() => {
            let data_sent_length = 0;

            while (this._data_queue.length > 0) {
                if (data_sent_length > this.MTU) {
                    print(`[x_net_table]当前帧发送数据量${data_sent_length},剩余${this._data_queue.length}条数据未发送，留到下一帧执行`);
                    return FrameTime();
                }

                let data = this._data_queue.shift();
                if (data == null) {
                    // print(`数据已经发完了，进入等待状态`);
                    return FrameTime();
                }
                let data_str = data.data;
                data_sent_length += data_str.length;

                // -1或者为null代表发送到所有客户端
                if (data.target == null || data.target == -1) {
                    // print(`给全体玩家发送数据${data_str}`);
                    CustomGameEventManager.Send_ServerToAllClients(`x_net_table`, {
                        data: data_str,
                    });
                }
                // 否则发送给对应玩家
                else {
                    // print(`给玩家${data.target}发送数据${data_str}`);
                    let playerId = data.target;
                    let player = PlayerResource.GetPlayer(playerId);

                    // 只有当玩家存在的时候才发给他
                    if (player != null && !player.IsNull()) {
                        CustomGameEventManager.Send_ServerToPlayer(player, `x_net_table`, {
                            data: data_str,
                        });
                    }
                }
            }

            return FrameTime();
        });
    }
}
