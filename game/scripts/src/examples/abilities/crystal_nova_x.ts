import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../../utils/dota_ts_adapter';

/**
 * 【x-template 技能范例】
 * 水晶室女-冰霜新星
 *
 * 请到 excels/技能表.xlsx 中查看技能配置
 * 也可以到 scripts/npc/abilities.txt 中检查生成的kv文件
 */
@registerAbility()
export class crystal_nova_x extends BaseAbility {
    /**
     * 获取技能类型，这个技能是一个点地板的技能，同时是一个AOE技能
     * 这个在KV表里也有配置，但是其实在表里不配置也可以
     * 这里的设定会覆盖表中的设定
     */
    override GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.POINT + AbilityBehavior.AOE;
    }

    override GetAOERadius(): number {
        return this.GetSpecialValueFor('aoe_radius');
    }

    override OnSpellStart() {
        const caster = this.GetCaster();
        const point = this.GetCursorPosition();
        // 获取技能数据
        const damage = this.GetSpecialValueFor('nova_damage');
        const radius = this.GetAOERadius();
        const visionRadius = this.GetSpecialValueFor('vision_radius');
        const visionDuration = this.GetSpecialValueFor('vision_duration');
        const duration = this.GetSpecialValueFor('duration');

        // 查找目标点范围内的敌人
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            point,
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO + UnitTargetType.BASIC,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        const damageTable: ApplyDamageOptions = {
            attacker: caster,
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            ability: this,
            victim: undefined, // 这里先不指定victim，之后会遍历enemies
        };

        enemies.forEach(enemy => {
            damageTable.victim = enemy;
            ApplyDamage(damageTable); // 应用伤害

            // 施加debuff
            modifier_crystal_nova_x_debuff.apply(enemy, caster, this, {});
        });

        // 增加视野
        AddFOWViewer(caster.GetTeamNumber(), point, visionRadius, visionDuration, false);
        this.PlayEffects(point, radius);
    }

    /**
     * 技能释放的特效和音效
     */
    PlayEffects(point: Vector, radius: number) {
        const particle = `particles/units/heroes/hero_crystalmaiden/maiden_crystal_nova.vpcf`;
        const sound = `Hero_Crystal.CrystalNova`;

        // 播放特效
        const effect = ParticleManager.CreateParticle(particle, ParticleAttachment.WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(effect, 0, point); // 设置特效的位置
        ParticleManager.SetParticleControl(effect, 1, Vector(radius, radius, radius)); // 设置特效的半径

        // 播放音效
        EmitSoundOnLocationWithCaster(point, sound, this.GetCaster());
    }

    override Precache(context: CScriptPrecacheContext): void {
        PrecacheResource('particle', `particles/units/heroes/hero_crystalmaiden/maiden_crystal_nova.vpcf`, context);
        PrecacheResource('particle', `particles/generic_gameplay/generic_slowed_cold.vpcf`, context);
        PrecacheResource('soundfile', `soundevents/game_sounds_heroes/game_sounds_crystal.vsndevts`, context);
    }
}

@registerModifier()
export class modifier_crystal_nova_x_debuff extends BaseModifier {
    private attackspeed_slow: number = 0;
    private movespeed_slow: number = 0;
    override IsHidden(): boolean {
        return false;
    }

    override IsDebuff(): boolean {
        return true;
    }

    override IsPurgable(): boolean {
        return true;
    }

    override OnCreated(): void {
        this.attackspeed_slow = this.GetAbility().GetSpecialValueFor('attackspeed_slow');
        this.movespeed_slow = this.GetAbility().GetSpecialValueFor('movespeed_slow');
        const duration = this.GetAbility().GetSpecialValueFor('duration');
        this.SetDuration(duration, true); // 设置持续时间，不刷新
    }

    override OnRefresh(): void {
        this.OnCreated();
    }

    /**
     * modifier的效果需要先声明注册才能生效
     * 这里声明了两个效果：
     * 1. 攻击速度降低
     * 2. 移动速度降低
     */
    override DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ATTACKSPEED_BONUS_CONSTANT, ModifierFunction.MOVESPEED_BONUS_PERCENTAGE];
    }

    override GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackspeed_slow;
    }

    override GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movespeed_slow;
    }

    // 效果状态
    override GetEffectName(): string {
        return `particles/generic_gameplay/generic_slowed_cold.vpcf`;
    }

    override GetEffectAttachType(): ParticleAttachment {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }
}
