/**
 *     MIT LICENSE

    Copyright (c) 2014 Enrique García Cota, Yuichi Tateno, Emmanuel Oga

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    BASED ON https://github.com/kikito/tween.lua
    Copyright (c) 2014 Enrique García Cota, Yuichi Tateno, Emmanuel Oga
    MIT LICENSE

    Modified to TypescriptToLua version by XavierCHN @2025.04.28


    @example
    ```Typescript
    import { tween } from './utils/tween';

    const pos = { x: 0, y: 0 };
    const end = { x: 100, y: 100 };
    const duration = 1;
    const myTween = tween(duration, pos, end, 'outQuad')
    let now = GameRules.GetGameTime();
    Timers.CreateTimer(() => {
        let newTime = GameRules.GetGameTime();
        let deltaTime = newTime - now;
        now = newTime;
        const finished = myTween.update(deltaTime);
        if (finished) {
            print('Tween finished!');
            return null;
        } else {
            print(pos.x, pos.y);
            return 0.033;
        }
    });
    ```
 */

const pow = math.pow,
    sin = math.sin,
    cos = math.cos,
    pi = math.pi,
    sqrt = math.sqrt,
    abs = math.abs,
    asin = math.asin;

namespace EasingFunctions {
    /**
     * 线性缓动函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function linear(t: number, b: number, c: number, d: number) {
        return (c * t) / d + b;
    }
    /**
     * 二次方缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inQuad(t: number, b: number, c: number, d: number) {
        return c * pow(t / d, 2) + b;
    }

    /**
     * 二次方缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outQuad(t: number, b: number, c: number, d: number) {
        t = t / d;
        return -c * t * (t - 2) + b;
    }

    /**
     * 二次方缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutQuad(t: number, b: number, c: number, d: number) {
        t = (t / d) * 2;
        if (t < 1) {
            return (c / 2) * pow(t, 2) + b;
        }
        return (-c / 2) * ((t - 1) * (t - 3) - 1) + b;
    }
    /**
     * 二次方缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInQuad(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outQuad(t * 2, b, c / 2, d);
        }
        return inQuad(t * 2 - d, b + c / 2, c / 2, d);
    }

    // cubic
    /**
     * 三次方缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inCubic(t: number, b: number, c: number, d: number) {
        return c * pow(t / d, 3) + b;
    }
    /**
     * 三次方缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outCubic(t: number, b: number, c: number, d: number) {
        return c * (pow(t / d - 1, 3) + 1) + b;
    }
    /**
     * 三次方缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutCubic(t: number, b: number, c: number, d: number) {
        t = (t / d) * 2;
        if (t < 1) {
            return (c / 2) * t * t * t + b;
        }
        t = t - 2;
        return (c / 2) * (t * t * t + 2) + b;
    }
    /**
     * 三次方缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInCubic(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outCubic(t * 2, b, c / 2, d);
        }
        return inCubic(t * 2 - d, b + c / 2, c / 2, d);
    }

    // quart
    /**
     * 四次方缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inQuart(t: number, b: number, c: number, d: number) {
        return c * pow(t / d, 4) + b;
    }
    /**
     * 四次方缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outQuart(t: number, b: number, c: number, d: number) {
        return -c * (pow(t / d - 1, 4) - 1) + b;
    }
    /**
     * 四次方缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutQuart(t: number, b: number, c: number, d: number) {
        t = (t / d) * 2;
        if (t < 1) {
            return (c / 2) * pow(t, 4) + b;
        }
        return (-c / 2) * (pow(t - 2, 4) - 2) + b;
    }
    /**
     * 四次方缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInQuart(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outQuart(t * 2, b, c / 2, d);
        }
        return inQuart(t * 2 - d, b + c / 2, c / 2, d);
    }

    /**
     * 五次方缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inQuint(t: number, b: number, c: number, d: number) {
        return c * pow(t / d, 5) + b;
    }
    /**
     * 五次方缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outQuint(t: number, b: number, c: number, d: number) {
        return c * (pow(t / d - 1, 5) + 1) + b;
    }
    /**
     * 五次方缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutQuint(t: number, b: number, c: number, d: number) {
        t = (t / d) * 2;
        if (t < 1) {
            return (c / 2) * pow(t, 5) + b;
        }
        return (c / 2) * (pow(t - 2, 5) + 2) + b;
    }
    /**
     * 五次方缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInQuint(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outQuint(t * 2, b, c / 2, d);
        }
        return inQuint(t * 2 - d, b + c / 2, c / 2, d);
    }

    // sine
    /**
     * 正弦缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inSine(t: number, b: number, c: number, d: number) {
        return -c * cos((t / d) * (pi / 2)) + c + b;
    }
    /**
     * 正弦缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outSine(t: number, b: number, c: number, d: number) {
        return c * sin((t / d) * (pi / 2)) + b;
    }
    /**
     * 正弦缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutSine(t: number, b: number, c: number, d: number) {
        return (-c / 2) * (cos((pi * t) / d) - 1) + b;
    }
    /**
     * 正弦缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInSine(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outSine(t * 2, b, c / 2, d);
        }
        return inSine(t * 2 - d, b + c / 2, c / 2, d);
    }

    // expo
    /**
     * 指数缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inExpo(t: number, b: number, c: number, d: number) {
        if (t === 0) {
            return b;
        }
        return c * pow(2, 10 * (t / d - 1)) + b - c * 0.001;
    }
    /**
     * 指数缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outExpo(t: number, b: number, c: number, d: number) {
        if (t === d) {
            return b + c;
        }
        return c * 1.001 * (-pow(2, (-10 * t) / d) + 1) + b;
    }
    /**
     * 指数缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutExpo(t: number, b: number, c: number, d: number) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        t = (t / d) * 2;
        if (t < 1) {
            return (c / 2) * pow(2, 10 * (t - 1)) + b - c * 0.0005;
        }
        return (c / 2) * 1.0005 * (-pow(2, -10 * (t - 1)) + 2) + b;
    }
    /**
     * 指数缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInExpo(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outExpo(t * 2, b, c / 2, d);
        }
        return inExpo(t * 2 - d, b + c / 2, c / 2, d);
    }

    // circ
    /**
     * 圆形缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inCirc(t: number, b: number, c: number, d: number) {
        return -c * (sqrt(1 - pow(t / d, 2)) - 1) + b;
    }
    /**
     * 圆形缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outCirc(t: number, b: number, c: number, d: number) {
        return c * sqrt(1 - pow(t / d - 1, 2)) + b;
    }
    /**
     * 圆形缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutCirc(t: number, b: number, c: number, d: number) {
        t = (t / d) * 2;
        if (t < 1) {
            return (-c / 2) * (sqrt(1 - t * t) - 1) + b;
        }
        t = t - 2;
        return (c / 2) * (sqrt(1 - t * t) + 1) + b;
    }
    /**
     * 圆形缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInCirc(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outCirc(t * 2, b, c / 2, d);
        }
        return inCirc(t * 2 - d, b + c / 2, c / 2, d);
    }

    // elastic
    /**
     * 计算弹性缓动所需的参数 p, a, s
     * @param p 周期
     * @param a 振幅
     * @param c 变化量
     * @param d 总时长
     * @returns 包含 p, a, s 的元组
     */
    function calculatePAS(p: number | undefined, a: number | undefined, c: number, d: number): [number, number, number] {
        p = p || d * 0.3;
        a = a || 0;
        if (a < abs(c)) {
            return [p, c, p / 4];
        }
        return [p, a, (p / (2 * pi)) * asin(c / a)];
    }
    /**
     * 弹性缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param a 振幅，可选参数
     * @param p 周期，可选参数
     * @returns 计算后的当前值
     */
    export function inElastic(t: number, b: number, c: number, d: number, a?: number, p?: number) {
        if (t === 0) {
            return b;
        }
        t = t / d;
        if (t === 1) {
            return b + c;
        }
        const [pVal, aVal, s] = calculatePAS(p, a, c, d);
        t = t - 1;
        return -(aVal * pow(2, 10 * t) * sin(((t * d - s) * (2 * pi)) / pVal)) + b;
    }
    /**
     * 弹性缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param a 振幅，可选参数
     * @param p 周期，可选参数
     * @returns 计算后的当前值
     */
    export function outElastic(t: number, b: number, c: number, d: number, a?: number, p?: number) {
        if (t === 0) {
            return b;
        }
        t = t / d;
        if (t === 1) {
            return b + c;
        }
        const [pVal, aVal, s] = calculatePAS(p, a, c, d);
        return aVal * pow(2, -10 * t) * sin(((t * d - s) * (2 * pi)) / pVal) + c + b;
    }
    /**
     * 弹性缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param a 振幅，可选参数
     * @param p 周期，可选参数
     * @returns 计算后的当前值
     */
    export function inOutElastic(t: number, b: number, c: number, d: number, a?: number, p?: number) {
        if (t === 0) {
            return b;
        }
        t = (t / d) * 2;
        if (t === 2) {
            return b + c;
        }
        const [pVal, aVal, s] = calculatePAS(p, a, c, d);
        t = t - 1;
        if (t < 0) {
            return -0.5 * (aVal * pow(2, 10 * t) * sin(((t * d - s) * (2 * pi)) / pVal)) + b;
        }
        return aVal * pow(2, -10 * t) * sin(((t * d - s) * (2 * pi)) / pVal) * 0.5 + c + b;
    }
    /**
     * 弹性缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param a 振幅，可选参数
     * @param p 周期，可选参数
     * @returns 计算后的当前值
     */
    export function outInElastic(t: number, b: number, c: number, d: number, a?: number, p?: number) {
        if (t < d / 2) {
            return outElastic(t * 2, b, c / 2, d, a, p);
        }
        return inElastic(t * 2 - d, b + c / 2, c / 2, d, a, p);
    }

    /**
     * 来自小丑牌的弹性缓动效果
     * fuck 数学太差了，小丑牌的弹性缓动效果怎么那么好
     * 不知道是不是小丑牌原创
     * 总归目前为止据我所知 © LocalThunk
     *
     * @export
     * @param {number} t 当前时间
     * @param {number} b 初始值
     * @param {number} c 变化量
     * @param {number} d 总时长
     * @return {number} 计算后的当前值
     */
    export function elasticBalatro(t: number, b: number, c: number, d: number): number {
        let p = (d - t) / d;
        p = -pow(2, 10 * p - 10) * sin(((p * 10 - 10.75) * (2 * pi)) / 3);
        return p * b + (1 - p) * (b + c);
    }

    // back
    /**
     * 回退缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param s 回退量，可选参数
     * @returns 计算后的当前值
     */
    export function inBack(t: number, b: number, c: number, d: number, s?: number) {
        s = s || 1.70158;
        t = t / d;
        return c * t * t * ((s + 1) * t - s) + b;
    }
    /**
     * 回退缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param s 回退量，可选参数
     * @returns 计算后的当前值
     */
    export function outBack(t: number, b: number, c: number, d: number, s?: number) {
        s = s || 1.70158;
        t = t / d - 1;
        return c * (t * t * ((s + 1) * t + s) + 1) + b;
    }
    /**
     * 回退缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param s 回退量，可选参数
     * @returns 计算后的当前值
     */
    export function inOutBack(t: number, b: number, c: number, d: number, s?: number) {
        s = (s || 1.70158) * 1.525;
        t = (t / d) * 2;
        if (t < 1) {
            return (c / 2) * (t * t * ((s + 1) * t - s)) + b;
        }
        t = t - 2;
        return (c / 2) * (t * t * ((s + 1) * t + s) + 2) + b;
    }
    /**
     * 回退缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @param s 回退量，可选参数
     * @returns 计算后的当前值
     */
    export function outInBack(t: number, b: number, c: number, d: number, s?: number) {
        if (t < d / 2) {
            return outBack(t * 2, b, c / 2, d, s);
        }
        return inBack(t * 2 - d, b + c / 2, c / 2, d, s);
    }

    // bounce
    /**
     * 弹跳缓动退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outBounce(t: number, b: number, c: number, d: number) {
        t = t / d;
        if (t < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        if (t < 2 / 2.75) {
            t = t - 1.5 / 2.75;
            return c * (7.5625 * t * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            t = t - 2.25 / 2.75;
            return c * (7.5625 * t * t + 0.9375) + b;
        }
        t = t - 2.625 / 2.75;
        return c * (7.5625 * t * t + 0.984375) + b;
    }
    /**
     * 弹跳缓动进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inBounce(t: number, b: number, c: number, d: number) {
        return c - outBounce(d - t, 0, c, d) + b;
    }
    /**
     * 弹跳缓动进入和退出函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function inOutBounce(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return inBounce(t * 2, 0, c, d) * 0.5 + b;
        }
        return outBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
    /**
     * 弹跳缓动退出和进入函数
     * @param t 当前时间
     * @param b 初始值
     * @param c 变化量
     * @param d 总时长
     * @returns 计算后的当前值
     */
    export function outInBounce(t: number, b: number, c: number, d: number) {
        if (t < d / 2) {
            return outBounce(t * 2, b, c / 2, d);
        }
        return inBounce(t * 2 - d, b + c / 2, c / 2, d);
    }
}

/**
 * 递归检查 subject 和 target 对象
 * @param subject 源对象
 * @param target 目标对象
 * @param path 当前路径
 */
function checkSubjectAndTargetRecursively(subject: any, target: any, path: string[] = []) {
    let targetType: string;
    let newPath: string[];
    for (const [k, targetValue] of pairs(target)) {
        (targetType = type(targetValue)), (newPath = copyTables({}, path));
        table.insert(newPath, tostring(k));
        if (targetType == 'number') {
            assert(type(subject[k]) == 'number', "Parameter '" + table.concat(newPath, '/') + "' is missing from subject or isn't a number");
        } else if (targetType == 'table') {
            checkSubjectAndTargetRecursively(subject[k], targetValue, newPath);
        } else {
            assert(targetType == 'number', "Parameter '" + table.concat(newPath, '/') + "' must be a number or table of numbers");
        }
    }
}

/**
 * 检查新参数的有效性
 * @param duration 持续时间
 * @param subject 源对象
 * @param target 目标对象
 * @param easing 缓动函数
 */
function checkNewParams(duration: number, subject: any, target: any, easing: any) {
    assert(type(duration) == 'number' && duration > 0, 'duration must be a positive number. Was ' + tostring(duration));
    const tsubject = type(subject);
    assert(tsubject == 'table' || tsubject == 'userdata', 'subject must be a table or userdata. Was ' + tostring(subject));
    assert(type(target) == 'table', 'target must be a table. Was ' + tostring(target));
    assert(type(easing) == 'function', 'easing must be a function. Was ' + tostring(easing));
    checkSubjectAndTargetRecursively(subject, target);
}

/**
 * 获取缓动函数
 * @param easing 缓动函数或函数名
 * @returns 缓动函数
 */
function getEasingFunction(easingName: string | EasingFunction = 'linear'): EasingFunction {
    if (typeof easingName === 'function') {
        return easingName;
    }
    const func = EasingFunctions[easingName];
    if (typeof func !== 'function') {
        error(`The easing function name '${easingName}' is invalid`);
    }
    return func;
}

/**
 * 对 subject 对象执行缓动操作
 * @param subject 源对象
 * @param target 目标对象
 * @param initial 初始对象
 * @param clock 当前时钟
 * @param duration 持续时间
 * @param easing 缓动函数
 */
function performEasingOnSubject(
    subject: any,
    target: any,
    initial: any,
    clock: number,
    duration: number,
    easing: (t: number, b: number, c: number, d: number) => number
) {
    let t: number, b: number, c: number, d: number;
    for (const k in target) {
        const v = target[k];
        if (type(v) === 'table') {
            performEasingOnSubject(subject[k], v, initial[k], clock, duration, easing);
        } else {
            t = clock;
            b = initial[k];
            c = v - initial[k];
            d = duration;
            subject[k] = easing(t, b, c, d);
        }
    }
}

/**
 * 复制表
 * @param destination 目标表
 * @param keysTable 键表
 * @param valuesTable 值表
 * @return {*} 复制后的目标表
 */
function copyTables(destination: any, keysTable: any, valuesTable?: any): any {
    valuesTable = valuesTable || keysTable;
    const mt = getmetatable(keysTable);
    if (mt && getmetatable(destination) !== null) {
        setmetatable(destination, mt);
    }
    for (const [k, v] of pairs(keysTable)) {
        if (type(v) == 'table') {
            destination[k] = copyTables({}, v, valuesTable[v]);
        } else {
            destination[k] = valuesTable[k];
        }
    }
    return destination;
}

class Tween<T extends object> {
    private initial: T | undefined;
    constructor(
        // private constructor params
        private duration: number,
        private subject: T,
        private target: Partial<T>,
        private easing: (t: number, b: number, c: number, d: number) => number,
        private clock: number = 0
    ) {}

    public set(clock: number) {
        assert(type(clock) == `number`, 'clock must be a number');

        this.initial = this.initial || copyTables({}, this.target, this.subject);
        this.clock = clock;

        if (this.clock <= 0) {
            this.clock = 0;
            copyTables(this.subject, this.initial);
        } else if (this.clock >= this.duration) {
            // the tween has expired
            this.clock = this.duration;
            copyTables(this.subject, this.target);
        } else {
            performEasingOnSubject(this.subject, this.target, this.initial, this.clock, this.duration, this.easing);
        }

        return this.clock >= this.duration;
    }

    public reset() {
        return this.set(0);
    }

    public update(dt: number) {
        assert(type(dt) == `number`, 'dt must be a number');
        return this.set(this.clock + dt);
    }
}

export type EasingFunctionName = keyof typeof EasingFunctions;
export type EasingFunction = (t: number, b: number, c: number, d: number) => number;

export function tween<T extends object>(duration: number, subject: T, target: Partial<T>, easing: EasingFunctionName | EasingFunction = 'linear') {
    const easingFunction = getEasingFunction(easing);
    checkNewParams(duration, subject, target, easingFunction);
    return new Tween(duration, subject, target, easingFunction);
}
