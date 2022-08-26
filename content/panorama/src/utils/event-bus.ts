import { DependencyList, useEffect } from 'react';
import { LocalEvent } from '../def/local_event_def';
import { EventEmitter } from 'events';

export function emitLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(
    eventName: EName,
    eventData: EData,
    ...args: any[]
) {
    GameUI.CustomUIConfig().EventBus.emit(eventName, eventData, ...args);
}

export function onLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(
    eventName: EName,
    listener: (evt: EData, ...arg: any[]) => void
) {
    GameUI.CustomUIConfig().EventBus.on(eventName, listener);
}

export function onceLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(
    eventName: EName,
    listener: (evt: EData, ...arg: any[]) => void
) {
    GameUI.CustomUIConfig().EventBus.once(eventName, listener);
}

export function offLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(
    eventName: EName,
    listener: (evt: EData, ...arg: any[]) => void
) {
    GameUI.CustomUIConfig().EventBus.off(eventName, listener);
}

export function useLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(
    eventName: EName,
    listener: (evt: EData, ...arg: any[]) => void,
    dependencies: DependencyList = []
) {
    useEffect(() => {
        onLocalEvent(eventName, listener);
        return () => {
            offLocalEvent(eventName, listener);
        };
    }, dependencies);
}

declare global {
    interface CustomUIConfig {
        EventBus: EventEmitter;
    }
}

GameUI.CustomUIConfig().EventBus = new EventEmitter();
GameUI.CustomUIConfig().EventBus.setMaxListeners(1000);

const bus = GameUI.CustomUIConfig().EventBus;

export default bus;
