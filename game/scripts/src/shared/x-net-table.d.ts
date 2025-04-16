declare interface XNetTableDefinitions {
    test_table: {
        test_key: {
            data_1: string;
            data_2?: number;
            data_3?: boolean[];
            data_t?: any;
        };
    };
    settings: {
        basicSettings: BasicSettings;
    };
}

declare interface BasicSettings {}

// 专门为性能调试模块增加的表
declare interface XNetTableDefinitions {
    performance_debug: {
        [key: string]: any;
    };
}

// 以下是库内部使用的，勿动
declare interface CustomGameEventDeclarations {
    x_net_table: {
        data:
            | string // 要么是以字符串形式发送的数据块
            | XNetTableObject; // 要么是一次性发送的数据
    };
}

declare interface XNetTableObject {
    table_name: string;
    key: string;
    content: any;
}

declare interface XNetTableDataJSON {
    table: string;
    key: string;
    value: any;
}
