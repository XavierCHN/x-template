interface CreateTimerOptions {
    callback?: (this: void) => void | number;
    endTime?: number;
    useGameTime?: boolean;
    useOldStyle?: boolean;
}

type CreateTimerOptionsContext<TThis> = CreateTimerOptions & {
    callback?: (this: TThis) => void | number;
};

declare interface Timers {
    CreateTimer(callback: (this: void) => void | number): string;
    CreateTimer<T>(callback: (this: T) => void | number, context: T): string;

    CreateTimer(name: string, options: CreateTimerOptions): string;
    CreateTimer<T>(name: string, options: CreateTimerOptionsContext<T>, context: T): string;

    CreateTimer(options: CreateTimerOptions): string;
    CreateTimer<T>(options: CreateTimerOptionsContext<T>, context: T): string;

    CreateTimer(delay: number, callback: (this: void) => void | number): string;
    CreateTimer<T>(delay: number, callback: (this: T) => void | number, context: T): string;

    RemoveTimer(name: string): void;
    RemoveTimers(killAll: boolean): void;
}

declare global {
    var Timers: Timers;
    interface CDOTAGameRules {
        Timers: Timers;
    }
}

export {};
