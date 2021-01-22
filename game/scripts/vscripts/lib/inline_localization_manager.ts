declare interface json {
    encode(value: any): string;
    decode(json_string: string): object;
}

declare global {
    interface InlineLocalizationManager {
        AddToken(key: string, value: string): void;
    }
}

// require the dkjson module provided by valve
if (json == null) { require('game/dkjson'); }

export class InlineLocalizationManager {
    private static inited: boolean;
    public static tokens: Record<string, string> = {};
    public static AddLuaAbility(name: string, localizationDef: { Name: string, Tokens: { [x: string]: string; }; }) {
        if (!IsInToolsMode()) return;
        if (!this.inited) this.Initialize();
        this.tokens[`dota_tooltip_ability_${name}`] = localizationDef.Name;
        for (let key in localizationDef.Tokens) {
            this.tokens[`dota_tooltip_ability_${name}_${key}`] = localizationDef.Tokens[key];
        }
    }
    public static AddLuaModifier(name: string, localizationDef: { Name: string, Description: string; }) {
        if (!IsInToolsMode()) return;
        if (!this.inited) this.Initialize();
        this.tokens[`dota_tooltip_ability_${name}`] = localizationDef.Name;
        this.tokens[`dota_tooltip_ability_${name}_description`] = localizationDef.Description;
    }
    public static AddToken(key: string, value: string) {
        if (!IsInToolsMode()) return;
        if (!this.inited) this.Initialize();
        this.tokens[key] = value;
    }
    public static SendSaveRequestToDevServer() {
        if (!IsInToolsMode()) return;
        // send request to dev server
        print("sending save request to dev server ===>");
        DeepPrintTable(this.tokens);
        let req = CreateHTTPRequestScriptVM('POST', 'http://127.0.0.1:62323/Localization');
        req.SetHTTPRequestGetOrPostParameter('data', json.encode(this.tokens));
        req.Send(() => {
            print("inline localization job's done!");
        });
    }
    private static Initialize() {
        // listen to game state changed event
        // send game event at game start and game ends
        // register a console command to manually call
        Convars.RegisterCommand('x_local', () => { this.SendSaveRequestToDevServer(); }, 'send inline localization data to dev server', ConVarFlags.FCVAR_NONE);
        ListenToGameEvent("dota_game_state_change", () => {
            let state = GameRules.State_Get();
            if (state == DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME || state == DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME) {
                this.SendSaveRequestToDevServer();
            }
        }, undefined);
    }
}