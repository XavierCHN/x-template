/**
 * 启动一个执行N次的定时器
 * @export
 * @param {(times?: number) => void} callback 回调函数，如果返回数值，可以变成一个可变间隔的定时器
 * @param {number} [times] 执行次数，如果不提供，那么只执行1次，如果不提供或者提供的数值为负数，那么会一直执行
 */
export function LoopByTimer(callback: (times?: number) => void | number, times?: number) {
    let repeatTimes = times ?? -10;
    Timers.CreateTimer(() => {
        repeatTimes--;
        const newInterval = callback(repeatTimes);
        if (repeatTimes == 0) {
            return;
        }
        if (newInterval != null && newInterval >= 0) return newInterval;
    });
}
