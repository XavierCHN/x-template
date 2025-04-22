import { BaseModifierMotionBoth, registerModifier } from '../../utils/dota_ts_adapter';

interface IGenericArcProps {
    speed?: number; // 速度 默认为 0
    duration?: number; // 持续时间 默认为 0
    distance?: number; // 距离 默认为0
    height?: number; // 高度 默认为0
    start_offset?: number; // 初始偏移 默认为0
    end_offset?: number; // 结束偏移 默认为0
    fix_end?: 0 | 1; // 如果设置为true，那么落地点的z轴必定保持和初始的z轴高度一致
    fix_duration?: 0 | 1; // 如果设置为false，那么只要接触到地面就会停止动作
    fix_height?: 0 | 1; // 如果设置为false，那么跳跃的最大高度将由距离自动设置
    target_x?: number; // 目标点x坐标 默认为0
    target_y?: number; // 目标点y坐标 默认为0
    dir_x?: number; // 方向x坐标 默认为0
    dir_y?: number; // 方向y坐标 默认为0
    isStun?: 0 | 1; // 是否眩晕
    isRestricted?: 0 | 1; // 是否禁止操作
    isForward?: 0 | 1; // 是否锁定面向
    activity?: GameActivity; // 跳跃时候的动作
}

@registerModifier()
export class modifier_generic_arc extends BaseModifierMotionBoth {
    private direction: Vector = Vector(1, 1, 0); // 方向 从 kv.dir_x/y 或kv.target_x/y获取
    private speed: number = 0; // 速度 默认为 0
    private duration: number = 0; // 持续时间 默认为 0
    private distance: number = 100; // 距离 默认为0
    private height: number = 100; // 高度 默认为0
    private start_offset: number = 0; // 初始偏移 默认为0
    private end_offset: number = 0; // 结束偏移 默认为0
    private fix_end: boolean = false; // 如果设置为true，那么落地点的z轴必定保持和初始的z轴高度一致
    private fix_duration: boolean = false; // 如果设置为false，那么只要接触到地面就会停止动作
    private fix_height: boolean = false; // 如果设置为false，那么跳跃的最大高度将由距离自动设置
    private isStun: boolean = true; // 是否眩晕
    private isRestricted: boolean = true; // 是否禁止操作
    private isForward: boolean = true; // 是否锁定面向
    private activity: GameActivity = GameActivity.DOTA_FLAIL; // 跳跃时候的动作
    private interrupted: boolean = false;
    private const1: number = 0;
    private const2: number = 0;
    private endCallback: (interrupted: boolean) => void = () => {};

    override OnCreated(kv: IGenericArcProps) {
        if (!IsServer()) return;
        this.interrupted = false;
        this.SetJumpParameters(kv);
        this.Jump();
    }

    override OnRefresh(kv: any) {
        this.OnCreated(kv);
    }

    override OnDestroy() {
        if (!IsServer()) return;
        const pos = this.GetParent().GetOrigin();
        this.GetParent().RemoveHorizontalMotionController(this);
        this.GetParent().RemoveVerticalMotionController(this);
        if (this.end_offset != 0) this.GetParent().SetOrigin(pos);
        if (this.endCallback) this.endCallback(this.interrupted);
    }

    override DeclareFunctions() {
        const funcs = [ModifierFunction.DISABLE_TURNING];
        if (this.GetStackCount() > 0) funcs.push(ModifierFunction.OVERRIDE_ANIMATION);
        return funcs;
    }

    override GetModifierDisableTurning() {
        if (!this.isForward) return 0;
        return 1;
    }

    override GetOverrideAnimation() {
        return this.GetStackCount();
    }

    override CheckState() {
        return {
            [ModifierState.STUNNED]: this.isStun || false,
            [ModifierState.COMMAND_RESTRICTED]: this.isRestricted || false,
            [ModifierState.NO_UNIT_COLLISION]: true,
        };
    }

    override UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number) {
        if (this.fix_duration && this.GetElapsedTime() >= this.duration) return;
        const pos = (me.GetOrigin() + this.direction * this.speed * dt) as Vector;
        me.SetOrigin(pos);
    }

    override UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number) {
        if (this.fix_duration && this.GetElapsedTime() >= this.duration) return;
        const pos = me.GetOrigin();
        const time = this.GetElapsedTime();
        const height = pos.z;
        const speed = this.GetVerticalSpeed(time);
        pos.z = height + speed * dt;
        me.SetOrigin(pos);
        if (!this.fix_duration) {
            const ground = GetGroundHeight(pos, me) + this.end_offset;
            if (pos.z <= ground) {
                pos.z = ground;
                me.SetOrigin(pos);
                this.Destroy();
            }
        }
    }

    override OnHorizontalMotionInterrupted() {
        this.interrupted = true;
        this.Destroy();
    }

    override OnVerticalMotionInterrupted() {
        this.interrupted = true;
        this.Destroy();
    }

    SetJumpParameters(kv: IGenericArcProps) {
        const parent = this.GetParent();

        this.fix_end = true;
        this.fix_duration = true;
        this.fix_height = true;
        if (kv.fix_end) this.fix_end = kv.fix_end == 1;
        if (kv.fix_duration) this.fix_duration = kv.fix_duration == 1;
        if (kv.fix_height) this.fix_height = kv.fix_height == 1;
        this.isStun = kv.isStun == 1;
        this.isRestricted = kv.isRestricted == 1;
        this.isForward = kv.isForward == 1;
        this.activity = kv.activity || 0;
        this.SetStackCount(this.activity);
        if (kv.target_x && kv.target_y) {
            const origin = parent.GetOrigin();
            let dir: Vector = (Vector(kv.target_x, kv.target_y, 0) - origin) as Vector;
            dir.z = 0;
            dir = dir.Normalized();
            this.direction = dir;
        }
        if (kv.dir_x && kv.dir_y) {
            this.direction = Vector(kv.dir_x, kv.dir_y, 0).Normalized();
        }
        if (!this.direction) {
            this.direction = parent.GetForwardVector();
        }
        this.duration = kv.duration;
        this.distance = kv.distance;
        this.speed = kv.speed;
        if (!this.duration) this.duration = this.distance / this.speed;
        if (!this.distance) this.distance = this.speed * this.duration;
        if (!this.speed) {
            this.distance = this.distance || 0;
            this.speed = this.distance / this.duration;
        }
        this.height = kv.height || 0;
        this.start_offset = kv.start_offset || 0;
        this.end_offset = kv.end_offset || 0;
        const pos_start = parent.GetOrigin();
        const pos_end = (pos_start + this.direction * this.distance) as Vector;
        const height_start = GetGroundHeight(pos_start, parent) + this.start_offset;
        let height_end = GetGroundHeight(pos_end, parent) + this.end_offset;
        let height_max;
        if (!this.fix_height) {
            this.height = Math.min(this.height, this.distance / 4);
        }
        if (this.fix_end) {
            height_end = height_start;
            height_max = height_start + this.height;
        } else {
            let tmin = height_start;
            let tmax = height_end;
            if (tmin > tmax) {
                tmin = height_end;
                tmax = height_start;
            }
            const delta = ((tmax - tmin) * 2) / 3;
            height_max = tmin + delta + this.height;
            if (!this.fix_duration) {
                this.SetDuration(-1, false);
            } else {
                this.SetDuration(this.duration, true);
            }
        }
        this.InitVerticalArc(height_start, height_max, height_end, this.duration);
    }

    InitVerticalArc(height_start: any, height_max: any, height_end: any, duration: any) {
        height_end = height_end - height_start;
        height_max = height_max - height_start;
        if (height_max < height_end) height_max = height_end + 0.01;
        if (height_max <= 0) height_max = 0.01;
        const duration_end = (1 + Math.sqrt(1 - height_end / height_max)) / 2;
        this.const1 = (4 * height_max * duration_end) / duration;
        this.const2 = (4 * height_max * duration_end * duration_end) / (duration * duration);
    }

    Jump() {
        if (this.distance > 0) {
            if (!this.ApplyHorizontalMotionController()) {
                this.interrupted = true;
                this.Destroy();
            }
        }
        if (this.height > 0) {
            if (!this.ApplyVerticalMotionController()) {
                this.interrupted = true;
                this.Destroy();
            }
        }
    }

    GetVerticalPos(time: number) {
        return this.const1 * time - this.const2 * time * time;
    }

    GetVerticalSpeed(time: number) {
        return this.const1 - 2 * this.const2 * time;
    }

    SetEndCallback(func: (interrupted: boolean) => void) {
        this.endCallback = func;
    }

    override IsHidden() {
        return true;
    }

    override IsDebuff() {
        return false;
    }

    override IsStunDebuff() {
        return false;
    }

    override IsPurgable() {
        return true;
    }

    override GetAttributes() {
        return ModifierAttribute.MULTIPLE;
    }
}
