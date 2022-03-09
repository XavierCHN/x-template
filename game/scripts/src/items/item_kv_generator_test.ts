import { BaseItem, registerAbility } from "../lib/dota_ts_adapter";

@registerAbility()
export class item_kv_generator_test extends BaseItem {
    OnEquip(): void {
        let damage = this.GetSpecialValueFor("damage");
        print(damage);
    }
}