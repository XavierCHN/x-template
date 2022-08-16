import { DependencyList, useEffect } from "react";
import { LocalEvent } from "../def/local_event_def";
import { EventEmitter } from "events";

export function emitLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(eventName: EName, eventData: EData, ...args: any[]) {
    bus.emit(eventName, eventData, ...args);
}

export function onLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(eventName: EName, listener: (evt: EData, ...arg: any[]) => void) {
    bus.on(eventName, listener);
}

export function onceLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(eventName: EName, listener: (evt: EData, ...arg: any[]) => void) {
    bus.once(eventName, listener);
}

export function offLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(eventName: EName, listener: (evt: EData, ...arg: any[]) => void) {
    bus.off(eventName, listener);
}

export function useLocalEvent<EName extends keyof LocalEvent, EData extends LocalEvent[EName]>(eventName: EName, listener: (evt: EData, ...arg: any[]) => void, dependencies: DependencyList = []) {
    useEffect(() => {
        onLocalEvent(eventName, listener);
        return () => {
            offLocalEvent(eventName, listener);
        };
    }, dependencies);
}

const bus = new EventEmitter();
bus.setMaxListeners(1000);
export default bus;
