// 面向所有人的XNetTables
declare interface XNetTableDefinations {
    test_table: {
        test_key: {
            data_1: string;
            data_2?: number;
            data_3?: boolean[];
        };
    };
    settings: {
        basicSettings: BasicSettings;
    };
}

// 单个玩家的XNetTables
declare interface PlayerXNetTableDefinations {}

declare interface BasicSettings {}

// 以下是库内部使用的，勿动
declare interface CustomGameEventDeclarations {
    x_net_table: { data: string };
}

declare interface XNetTableDataJSON {
    table: string;
    key: string;
    value: any;
}
