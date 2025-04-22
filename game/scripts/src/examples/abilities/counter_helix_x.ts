import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../../utils/dota_ts_adapter';

/**
 * 【x-template 技能范例】
 * 被动技能：反击螺旋
 *
 *
 * 请到 excels/技能表.xlsx 中查看技能配置
 * 也可以到 scripts/npc/abilities.txt 中检查生成的kv文件
 */
@registerAbility()
export class counter_helix_x extends BaseAbility {
    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.PASSIVE;
    }

    GetIntrinsicModifierName(): string {
        return modifier_counter_helix_x.name;
    }
}

@registerModifier()
export class modifier_counter_helix_x extends BaseModifier {
    private radius: number = 100;
    private hit_count: number = 99;
    private hits: number = 0;
    private damageTable: ApplyDamageOptions;

    override IsHidden(): boolean {
        return false;
    }

    override IsPurgable(): boolean {
        return false;
    }

    override OnCreated(params: object): void {
        this.radius = this.GetAbility().GetSpecialValueFor('radius');
        this.hit_count = this.GetAbility().GetSpecialValueFor('hit_count');
        const damage = this.GetAbility().GetSpecialValueFor('damage');

        if (!IsServer()) return;

        this.SetStackCount(this.hit_count);
        this.damageTable = {
            victim: null,
            attacker: this.GetCaster(),
            damage: damage,
            ability: this.GetAbility(),
            damage_type: DamageTypes.PURE,
            damage_flags: DamageFlag.NONE,
        };
    }

    // 技能升级的时候会刷新modifier，这里我们需要重新设置技能的伤害和攻击计数
    override OnRefresh(params: object): void {
        if (!IsServer()) return;
        const damage = this.GetAbility().GetSpecialValueFor('damage');
        this.damageTable.damage = damage;
        this.hit_count = this.GetAbility().GetSpecialValueFor('hit_count');
        this.SetStackCount(this.hit_count - this.hits);
    }

    /**
     * 这里我们需要做的是受到攻击的效果，所以我们注册了ON_ATTACK_LANDED事件
     * 这样在回调里面我们再做受到攻击进行反击螺旋的效果
     */
    override DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK_LANDED];
    }

    override OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;

        // 这里要做许多的判定，这是因为这个事件会在所有的受到攻击（不管攻击者和目标是谁）都会触发
        if (event.target !== this.GetParent()) return; // 被攻击者必须是自己
        if (this.GetParent().PassivesDisabled()) return; // 不能是被动禁用状态
        if (event.attacker.GetTeamNumber() === this.GetParent().GetTeamNumber()) return; // 攻击者必须是敌人
        if (event.attacker.IsOther() || event.attacker.IsBuilding()) return; // 受到建筑物的攻击不触发

        this.hits++; // 累积攻击计数
        this.SetStackCount(this.hit_count - this.hits); // 设置剩余攻击次数(用来在UI上显示)
        if (this.hits >= this.hit_count) {
            // 重置攻击计数
            this.hits = 0;
            this.SetStackCount(this.hit_count);

            // 寻找周围的敌人
            const enemies = FindUnitsInRadius(
                this.GetParent().GetTeamNumber(), // 敌人的队伍
                this.GetParent().GetAbsOrigin(), // 敌人的位置
                undefined, // 查找范围
                this.radius, // 查找范围
                UnitTargetTeam.ENEMY, // 查找敌人
                UnitTargetType.HERO + UnitTargetType.BASIC, // 查找英雄和小兵
                UnitTargetFlags.MAGIC_IMMUNE_ENEMIES, // 查找标志，对魔免单位也有效
                FindOrder.ANY, // 查找顺序
                false
            );

            enemies.forEach(enemy => {
                this.damageTable.victim = enemy; // 设置目标
                ApplyDamage(this.damageTable); // 应用伤害
            });

            this.PlayEffects();
        }
    }

    PlayEffects() {
        const particle = `particles/units/heroes/hero_axe/axe_counterhelix_ad.vpcf`;
        const sound = `Hero_Axe.CounterHelix`;

        const effect = ParticleManager.CreateParticle(particle, ParticleAttachment.ABSORIGIN_FOLLOW, this.GetCaster()); // 创建特效
        ParticleManager.ReleaseParticleIndex(effect); // 释放特效

        EmitSoundOn(sound, this.GetParent());
    }
}
