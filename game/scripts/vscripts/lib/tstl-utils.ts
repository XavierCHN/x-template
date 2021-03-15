const global = globalThis as typeof globalThis & {
    reloadCache: Record<string, any>;
    eventListenerIDs: EventListenerID[];
    customEventListenerIDs: CustomGameEventListenerID[];
};
if (global.reloadCache === undefined) {
    global.reloadCache = {};
}

export function reloadable<T extends { new(...args: any[]): {}; }>(constructor: T): T {
    const className = constructor.name;
    if (global.reloadCache[className] === undefined) {
        global.reloadCache[className] = constructor;
    }

    Object.assign(global.reloadCache[className].prototype, constructor.prototype);
    return global.reloadCache[className];
}

if (global.eventListenerIDs == null) {
    global.eventListenerIDs = [];
} else {
    global.eventListenerIDs.reverse().forEach(id => StopListeningToGameEvent(id));
    global.eventListenerIDs = [];
}

if (global.customEventListenerIDs == null) {
    global.customEventListenerIDs = [];
} else {
    global.customEventListenerIDs.reverse().forEach(id => CustomGameEventManager.UnregisterListener(id));
    global.customEventListenerIDs = [];
}

/** @noSelf */
export function onEvent(eventName: keyof GameEventDeclarations) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const eventID = ListenToGameEvent(eventName, Dynamic_Wrap(target, key), target);
        global.eventListenerIDs.push(eventID);
    };
}

/** @noSelf */
export function onUIEvent<T extends string | object>
    (eventName: (T extends string ? T : string) | keyof CustomGameEventDeclarations) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const eventID = CustomGameEventManager.RegisterListener(eventName, Dynamic_Wrap(target, key));
        global.customEventListenerIDs.push(eventID);
    };
}