import { useEffect, useState } from "react";

/**
 * Get the value of a key in a Player custom NetTable and updates component when it changes.
 * @export
 * @template TName extends keyof PlayerCustomNetTableDeclarations
 * @template T extends PlayerCustomNetTableDeclarations
 * @template K
 * @param {number} playerId
 * @param {TName} name
 * @param {K} key
 * @returns {NetworkedData<T[K]>}
 */
export function usePlayerNetTableKey<
    TName extends keyof PlayerCustomNetTableDeclarations,
    T extends PlayerCustomNetTableDeclarations[TName],
    K extends keyof T
>(name: TName, key: K, playerId: number = Players.GetLocalPlayer()): NetworkedData<T[K]> {
    // @ts-ignore
    const [value, setValue] = useState(() => CustomNetTables.GetTableValue(name, `${key}${playerId}` as never));
    useEffect(() => {
        // @ts-ignore
        const listener = CustomNetTables.SubscribeNetTableListener(name, (_, eventKey, eventValue) => {
            if (eventKey == `${key}${playerId}`) {
                setValue(eventValue as any);
            }
        });
        return () => CustomNetTables.UnsubscribeNetTableListener(listener);
    }, [name, key]);
    return value as any;
}

export function usePlayerNetTableValues<
    TName extends keyof PlayerCustomNetTableDeclarations,
    T extends PlayerCustomNetTableDeclarations[TName]
>(name: TName): NetworkedData<T> {
    // @ts-ignore
    const [value, setValue] = useState(() => CustomNetTables.GetAllTableValues(name).reduce((accumulator, pair) => (Object.assign(Object.assign({}, accumulator), { [pair.key]: pair.value })), {}));
    useEffect(() => {
        // @ts-ignore
        const listener = CustomNetTables.SubscribeNetTableListener(name, (_, eventKey, eventValue) => {
            setValue((current) => (Object.assign(Object.assign({}, current), { [eventKey]: eventValue })));
        });
        return () => CustomNetTables.UnsubscribeNetTableListener(listener);
    }, [name]);
    return value as any;
}