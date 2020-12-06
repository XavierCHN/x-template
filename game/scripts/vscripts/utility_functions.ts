export function setPlayerNetTableValue<
    TName extends keyof PlayerCustomNetTableDeclarations,
    T extends PlayerCustomNetTableDeclarations[TName],
    K extends keyof T
>(playerId: PlayerID, tableName: T, keyName: K, value: T[K]) {
    // @ts-ignore
    CustomNetTables.SetTableValue(name, `${key}${playerId}`, value); // TODO, someone say it should be json to improve speed?
}