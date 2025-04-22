import { BaseAbility, BaseModifierMotionBoth, registerAbility, registerModifier } from '../../utils/dota_ts_adapter';
import { modifier_generic_arc } from '../modifiers/modifier_generic_arc';

@registerAbility()
export class tiny_toss_x extends BaseAbility {
    /**
     * 查找可以投掷的目标
     * 最近的，非施法者，非远古单位，且非正在被投掷的目标
     */
    FindTossTarget(): CDOTA_BaseNPC | null {
        if (!IsServer()) return;
        const caster = this.GetCaster();
        const radius = this.GetSpecialValueFor('grab_radius');
        const units = FindUnitsInRadius(
            caster.GetTeamNumber(),
            caster.GetOrigin(),
            undefined,
            radius,
            UnitTargetTeam.BOTH,
            UnitTargetType.HERO + UnitTargetType.BASIC,
            UnitTargetFlags.NONE,
            FindOrder.CLOSEST,
            false
        );
        let target: CDOTA_BaseNPC;
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (unit !== caster && !unit.IsAncient() && !modifier_tiny_toss_x.find_on(unit)) {
                target = unit;
                break;
            }
        }
        return target;
    }

    /** 必须有可以投掷的目标才可以施法 */
    override OnAbilityPhaseStart(): boolean {
        if (!IsServer()) return;
        return this.FindTossTarget() != null;
    }

    /**
     * 这里我们把等级为4级的投掷目标设置成可以点地板
     * 其他的等级需要选定一个目标
     * 这里只是为了展示lua技能系统的能力
     * 实际上并不是这样子
     */
    GetBehavior(): AbilityBehavior {
        const level = this.GetLevel();
        let behavior = AbilityBehavior.AOE + AbilityBehavior.IGNORE_BACKSWING;
        if (level >= 4) {
            behavior += AbilityBehavior.POINT;
        } else {
            behavior += AbilityBehavior.UNIT_TARGET;
        }
        return behavior;
    }

    override OnSpellStart(): void {
        if (!IsServer()) return;
        const target = this.GetCursorTarget();
        const victim = this.FindTossTarget();
        if (victim == null) return;

        let target_pos = this.GetCursorPosition();
        if (target != null) target_pos = target.GetOrigin();
        const victim_origin = victim.GetOrigin();
        this.StartToss(victim, victim_origin, target_pos);
    }

    StartToss(victim: CDOTA_BaseNPC, victim_origin: Vector, target_pos: Vector) {
        if (!IsServer()) return;
        const direction = (target_pos - victim_origin) as Vector;
        modifier_tiny_toss_x.apply(victim, this.GetCaster(), this, {
            target_x: target_pos.x,
            target_y: target_pos.y,
            target_z: target_pos.z,
            direction_x: direction.x,
            direction_y: direction.y,
            direction_z: 0,
        });
    }

    override CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCaster() == target) {
            return UnitFilterResult.FAIL_CUSTOM;
        }
        return UnitFilterResult.SUCCESS;
    }

    override GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (this.GetCaster() == target) {
            return '#dota_hud_error_cant_cast_on_self';
        }
        return '';
    }

    override GetAOERadius(): number {
        return this.GetSpecialValueFor('radius');
    }
}

interface IModifierTinyTossXParams {
    target_x: number;
    target_y: number;
    target_z: number;
    direction_x: number;
    direction_y: number;
    direction_z: number;
}

@registerModifier()
export class modifier_tiny_toss_x extends BaseModifierMotionBoth {
    caster: CDOTA_BaseNPC;
    parent: CDOTA_BaseNPC;
    damage: number;
    radius: number;
    target_position: Vector;
    ability: tiny_toss_x;
    arc: modifier_generic_arc;
    distance: number;
    duration: number;
    speed: number;
    accel: number;
    maxSpeed: number;
    start_position: Vector;

    override OnCreated(params: IModifierTinyTossXParams): void {
        this.caster = this.GetCaster();
        this.parent = this.GetParent();
        this.ability = this.GetAbility()! as tiny_toss_x;
        this.damage = this.ability.GetSpecialValueFor('toss_damage') || 0;
        this.radius = this.ability.GetSpecialValueFor('radius') || 0;
        if (!IsServer()) return;

        const duration = this.ability.GetSpecialValueFor('duration');
        const height = 850;
        this.start_position = this.parent.GetOrigin();
        this.target_position = Vector(params.target_x, params.target_y, params.target_z);

        this.arc = modifier_generic_arc.apply(this.parent, this.caster, this.ability, {
            duration: duration,
            distance: 0,
            height: height,
            fix_duration: 0,
            isStun: 1,
            activity: GameActivity.DOTA_FLAIL,
        });

        this.arc.SetEndCallback(interrupted => {
            if (!this) return;
            this.Destroy();

            if (interrupted) return;

            const enemies = FindUnitsInRadius(
                this.caster.GetTeamNumber(),
                this.parent.GetOrigin(),
                undefined,
                this.radius,
                UnitTargetTeam.ENEMY,
                UnitTargetType.HERO + UnitTargetType.BASIC,
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false
            );

            print(`find ${enemies.length} enemies`);

            enemies.forEach(enemy => {
                const damage: ApplyDamageOptions = {
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: this.ability.GetAbilityDamageType(),
                    damage_flags: DamageFlag.NONE,
                    ability: this.ability,
                    victim: enemy,
                };
                if (enemy == this.parent) {
                    damage.damage *= 1 + this.ability.GetSpecialValueFor('bonus_damage_pct') / 100;
                }
                ApplyDamage(damage);
            });

            GridNav.DestroyTreesAroundPoint(this.parent.GetOrigin(), this.radius, false);
            EmitSoundOn(`Ability.TossImpact`, this.parent);
        });

        let direction = (this.target_position - this.parent.GetOrigin()) as Vector;
        const distance = direction.Length2D();
        direction = direction.Normalized();
        direction.z = 0;
        this.distance = distance;
        if (this.distance == 0) this.distance = 1;
        this.duration = duration;
        this.speed = distance / this.duration;
        this.accel = 100;
        this.maxSpeed = 3000;

        if (!this.ApplyHorizontalMotionController()) {
            this.Destroy();
            return;
        }

        EmitSoundOn(`Ability.TossThrow`, this.caster);
        EmitSoundOn(`Hero_Tiny.Toss.Target`, this.parent);
    }

    override OnDestroy(): void {
        if (!IsServer()) return;
        this.GetParent().RemoveHorizontalMotionController(this);
    }

    override CheckState() {
        return { [ModifierState.STUNNED]: true };
    }

    override UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) return;
        const target = this.target_position;
        const parent = this.parent.GetOrigin();
        const duration = this.GetElapsedTime();
        let direction: Vector = (target - parent) as Vector;
        const distance = direction.Length2D();
        direction.z = 0;
        direction = direction.Normalized();
        const originalDistance = (duration / this.duration) * this.distance;
        let expectedSpeed;
        if (this.GetElapsedTime() >= this.duration) expectedSpeed = this.speed;
        else expectedSpeed = distance / (this.duration - this.GetElapsedTime());
        if (this.speed < expectedSpeed) this.speed = Math.min(this.speed + this.accel, this.maxSpeed);
        else this.speed = Math.max(this.speed - this.accel, 0);
        const pos = (parent + direction * this.speed * dt) as Vector;
        me.SetOrigin(pos);
    }

    override OnHorizontalMotionInterrupted() {
        if (!IsServer()) return;
        this.Destroy();
    }

    override GetEffectName() {
        return 'particles/units/heroes/hero_tiny/tiny_toss_blur.vpcf';
    }

    override GetEffectAttachType() {
        return ParticleAttachment.ABSORIGIN_FOLLOW;
    }

    override IsHidden() {
        return true;
    }

    override IsDebuff() {
        return this.GetCaster()!.GetTeamNumber() != this.GetParent().GetTeamNumber();
    }

    override IsStunDebuff() {
        return true;
    }

    override IsPurgable() {
        return true;
    }
}
