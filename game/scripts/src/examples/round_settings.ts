/** 如果出现round_settings不存在的错误，请先执行 yarn dev */
import * as round_settings from '../json/round_settings.json';

/**
 * 回合设定
 * @param Count 刷怪数量
 * @param Name 怪物名称
 * @param Interval 刷怪间隔
 */
declare type RoundSetting = typeof round_settings['round_1'];

export class RoundSettings {
    /** 其他地方获取回合配置的方法 */
    public static GetRoundSettings(round: number): RoundSetting {
        return round_settings[`round_${round}`];
    }
}
