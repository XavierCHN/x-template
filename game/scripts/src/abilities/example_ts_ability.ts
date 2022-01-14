import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter";

@registerAbility()
export class example_ts_ability extends BaseAbility {
    BaseProperties: AbilityBaseProperties = {
        TextureName: "example_ts_ability",
        Behavior: [
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING
        ],
        SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
        CastRange: 1200,
        ManaCost: 1000,
    };
    SpecialValues: AbilitySpecials = {
        duration: 1,
        radius: 200,
        speed: [1, 2, 3, 4]
    };
    CustomProperties: AbilityCustomProperties = {
        MyVar: 2,
    };
}