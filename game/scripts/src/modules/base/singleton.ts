/**
 * 单例模式基类，所有的单例模式模块都应该继承自这个类
 * @export
 * @class Singleton
 */
export abstract class Singleton {
    static getInstance() {
        if ((<any>GameRules)[this.name] == null) {
            // @ts-expect-error TS:2551 - Cannot create an instance of an abstract class.
            (<any>GameRules)[this.name] = new this();
        }
        return (<any>GameRules)[this.name];
    }
    public abstract Activate(): void;
    public abstract Reload(): void;
}

export type SingletonGameModule = (new () => Singleton) & {
    [K in keyof typeof Singleton]: typeof Singleton[K];
};
