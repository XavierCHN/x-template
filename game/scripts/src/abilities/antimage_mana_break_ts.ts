import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../lib/dota_ts_adapter";

@registerAbility()
export class antimage_mana_break_ts extends BaseAbility {
    AbilityTextureName: `antimage_mana_break`;
    BaseProperties: AbilityBaseProperties = {
        FightRecapLevel: 1,
        MaxLevel: 4,
        Behavior: AbilityBehavior.PASSIVE,
        UnitDamageType: DamageTypes.PHYSICAL,
        SpellImmunityType: SpellImmunityTypes.ENEMIES_NO,
    };
    AbilityType = AbilityTypes.BASIC;
    SpecialValues: AbilitySpecials = {
        mana_per_hit: 0.5,
        damage_per_burn: [28, 40, 52, 64]
    };

    GetIntrinsicModifierName(): string {
        return `modifier_antimage_mana_break_lua`;
    }
}

@registerModifier()
export class modifier_antimage_mana_break_lua extends BaseModifier {
    mana_per_hit: number = 0;
    damage_per_burn: number = 0;
    IsHidden() { return true; }
    IsPurgable() { return false; }
    OnCreated() {
        this.mana_per_hit = this.GetAbility().GetSpecialValueFor(`mana_per_hit`);
        this.damage_per_burn = this.GetAbility().GetSpecialValueFor(`damage_per_burn`);
    }
    OnRefresh() {
        this.mana_per_hit = this.GetAbility().GetSpecialValueFor(`mana_per_hit`);
        this.damage_per_burn = this.GetAbility().GetSpecialValueFor(`damage_per_burn`);
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PROCATTACK_BONUS_DAMAGE_PHYSICAL];
    }
    GetModifierProcAttack_BonusDamage_Physical(event: ModifierAttackEvent): number {
        if (!IsServer()) return;
        if (this.GetParent().PassivesDisabled()) return;

        let target = event.target;
        let result = UnitFilter(
            target,
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO + UnitTargetType.CREEP,
            UnitTargetFlags.MANA_ONLY,
            this.GetParent().GetTeamNumber()
        );
        if (result == UnitFilterResult.SUCCESS) {
            let mana_burn = math.min(target.GetMana(), this.mana_per_hit);
            target.ReduceMana(mana_burn);
            this.PlayEffects(target);
            return mana_burn * this.damage_per_burn;
        }
    }
    PlayEffects(target: CDOTA_BaseNPC) {
        let fx = `particles/generic_gameplay/generic_manaburn.vpcf`;
        let sound = `Hero_Antimage.ManaBreak`;
        let pcf = ParticleManager.CreateParticle(fx, ParticleAttachment.ABSORIGIN, target);
        ParticleManager.ReleaseParticleIndex(pcf);
        EmitSoundOn(sound, target);
    }
}