## 文件夹内容说明

#### gameevents.d.ts
声明自定义游戏事件的参数类型，包括 `CustomGameEventManager.Send_ServerToAllClients`等一系列函数的参数都应当在此文件声明

#### net_tables.d.ts
声明网表的参数类型，网表的字段还应当到 `game/scripts/custom_net_tables.txt`中填写（本空项目并未提供此文件，您可以到官方范例中复制）

### x-net-table.d.ts
本项目使用游戏事件模拟的网表，用来解决官方的网表对于其大小的限制，他的前后端源码可以在 `game/scripts/src/modules/xnet-table.ts`和`panorama/src/utils/x-nettable-dispatcher.ts`找到，当然，此模块机制并不完善（可能不一定满足您项目的需求），请酌情使用