export interface BaseAbility extends CDOTA_Ability_Lua {}
export class BaseAbility {}

export interface BaseItem extends CDOTA_Item_Lua {}
export class BaseItem {}

export interface BaseModifier extends CDOTA_Modifier_Lua {}

/** apply方法的参数需要保持和modifier的OnCreated方法的参数一致 */
/** the parameters of the apply method need to be consistent with the parameters of the OnCreated method of the modifier. */
type InstanceTypeOnCreatedParameters<T extends typeof BaseModifier> = T extends abstract new (...args: any) => infer R
    ? R extends { OnCreated: (arg: infer P) => any }
        ? P
        : never
    : never;

export class BaseModifier {
    public static apply<T extends typeof BaseModifier, Args extends InstanceTypeOnCreatedParameters<T>>(
        this: T,
        target: CDOTA_BaseNPC,
        caster?: CDOTA_BaseNPC,
        ability?: CDOTABaseAbility,
        modifierTable?: Args
    ): InstanceType<T> {
        return target.AddNewModifier(caster, ability, this.name, modifierTable) as unknown as InstanceType<T>;
    }

    public static find_on<T extends typeof BaseModifier>(this: T, target: CDOTA_BaseNPC): InstanceType<T> {
        return target.FindModifierByName(this.name) as unknown as InstanceType<T>;
    }

    public static remove<T extends typeof BaseModifier>(this: T, target: CDOTA_BaseNPC): void {
        target.RemoveModifierByName(this.name);
    }
}

export interface BaseModifierMotionHorizontal extends CDOTA_Modifier_Lua_Horizontal_Motion {}
export class BaseModifierMotionHorizontal extends BaseModifier {}

export interface BaseModifierMotionVertical extends CDOTA_Modifier_Lua_Vertical_Motion {}
export class BaseModifierMotionVertical extends BaseModifier {}

export interface BaseModifierMotionBoth extends CDOTA_Modifier_Lua_Motion_Both {}
export class BaseModifierMotionBoth extends BaseModifier {}

// Add standard base classes to prototype chain to make `super.*` work as `self.BaseClass.*`
setmetatable(BaseAbility.prototype, { __index: CDOTA_Ability_Lua ?? C_DOTA_Ability_Lua });
setmetatable(BaseItem.prototype, { __index: CDOTA_Item_Lua ?? C_DOTA_Item_Lua });
setmetatable(BaseModifier.prototype, { __index: CDOTA_Modifier_Lua });



export const registerAbility = (name?: string, filePath?: string, env?: any) => (ability: new () => CDOTA_Ability_Lua | CDOTA_Item_Lua) => {
    if (name !== undefined) {
        // @ts-ignore
        ability.name = name;
    } else {
        name = ability.name;
    }

    // 如果没有提供 env，使用 _G 作为回退
    const targetEnv = env ?? _G;

    targetEnv[name] = {};

    toDotaClassInstance(targetEnv[name], ability);

    const originalSpawn = (targetEnv[name] as CDOTA_Ability_Lua).Spawn;
    targetEnv[name].Spawn = function () {
        this.____constructor();
        if (originalSpawn) {
            originalSpawn.call(this);
        }
    };
};

export const registerModifier = (name?: string, filePath?: string, env?: any) => (modifier: new () => CDOTA_Modifier_Lua) => {
    if (name !== undefined) {
        // @ts-ignore
        modifier.name = name;
    } else {
        name = modifier.name;
    }

    // 如果没有提供 env，使用 _G 作为回退
    const targetEnv = env ?? _G;
    // 如果用户提供了 filePath，使用它；否则使用空字符串（tstl 插件会自动注入）
    const fileName = filePath ?? '';

    targetEnv[name] = {};

    toDotaClassInstance(targetEnv[name], modifier);

    const originalOnCreated = (targetEnv[name] as CDOTA_Modifier_Lua).OnCreated;
    targetEnv[name].OnCreated = function (parameters: any) {
        this.____constructor();
        if (originalOnCreated) {
            originalOnCreated.call(this, parameters);
        }
    };

    let type = LuaModifierMotionType.NONE;
    let base = (modifier as any).____super;
    while (base) {
        if (base === BaseModifierMotionBoth) {
            type = LuaModifierMotionType.BOTH;
            break;
        } else if (base === BaseModifierMotionHorizontal) {
            type = LuaModifierMotionType.HORIZONTAL;
            break;
        } else if (base === BaseModifierMotionVertical) {
            type = LuaModifierMotionType.VERTICAL;
            break;
        }

        base = base.____super;
    }

    LinkLuaModifier(name, fileName, type);
};

function toDotaClassInstance(instance: any, table: new () => any) {
    let { prototype } = table;
    while (prototype) {
        for (const key in prototype) {
            // Using hasOwnProperty to ignore methods from metatable added by ExtendInstance
            // https://github.com/SteamDatabase/GameTracking-Dota2/blob/7edcaa294bdcf493df0846f8bbcd4d47a5c3bd57/game/core/scripts/vscripts/init.lua#L195
            if (!instance.hasOwnProperty(key)) {
                if (key != '__index') {
                    instance[key] = prototype[key];
                }
            }
        }

        prototype = getmetatable(prototype);
    }
}
