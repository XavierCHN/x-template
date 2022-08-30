/**
 * 使用event-bus发送的事件在此处声明
 * @export
 * @interface LocalEvent
 */
export interface LocalEvent {
    // 收到网表更新事件
    x_net_table: {
        table_name: string;
        key: string;
        content: any;
    };
}
