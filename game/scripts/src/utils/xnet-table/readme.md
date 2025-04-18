# XNetTale模块说明文档

## 概述
`XNetTable` 是一个使用事件来模拟网络表的模块，主要目的是实现 `Valve` 官方 `CustomNetTables` 的功能，同时突破网络表 2MB 的数据传输限制，支持更大的数据传输。需要注意的是，发送事件会占用服务器帧时间，对于特别大的数据会进行拆分发送后再组合。对于游戏中的小体积高频数据同步，依然推荐使用原生的 `CustomNetTables` 以避免影响网络性能。

[官方的CustomNetTables说明文档](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Custom_Nettables)

## 用法

### 关于 `XNetTableDefinitions`
`XNetTableDefinitions`和 `shared`文件夹中的其他内容一样，都是为了保持前后端的数据结构一致而采用的写法，因此，请提前在 `game\scripts\src\shared\x-net-table.d.ts` 文件夹中写明前后端传输的数据结构

### 设置所有玩家共享的数据
```
GameRules.XNetTable.SetTableValue(tname, key, value);
```

### 设置某个玩家独享的数据
```
GameRules.XNetTable.SetPlayerTableValue(playerId, tname, key, value);
```


## 前端使用数据推荐使用 React Hook
```tsx
const Root: FC = () => {
    const data = useXNetTableKey(`test_table`, `test_key`, { data_1: 'unknown' });
    return <Label text={data.data_1} />
}
```


## 未尽事宜

- 发送事件会占用服务器帧时间，对于特别大的数据会进行拆分发送后再组合。
- 游戏中的小体积高频数据同步，建议使用原生的 CustomNetTables 以避免影响网络性能。
- 同一帧内多次更新同一个网络表项会输出警告信息，建议优化代码，确保一帧最多更新一次。
- 请注意查阅 `content/panorama/utils/x-nettable-dispatcher.js` 找到前端关于数据的处理方法