export function Clamp(num: number, min: number, max: number): number {
    return num <= min ? min : num >= max ? max : num;
}

export function Lerp(percent: number, a: number, b: number): number {
    return a + percent * (b - a);
}

export function RemapVal(num: number, a: number, b: number, c: number, d: number): number {
    if (a == b) return c;

    const percent = (num - a) / (b - a);
    return Lerp(percent, c, d);
}

export function RemapValClamped(num: number, a: number, b: number, c: number, d: number): number {
    if (a == b) return c;

    const percent = Clamp((num - a) / (b - a), 0.0, 1.0);

    return Lerp(percent, c, d);
}

interface Dictionary<T> {
    [Key: string]: T;
}

export function ToMap<K extends string | number, V>(arr: V[], key: (value: V, index: number, arr: V[]) => K): Dictionary<V> {
    const map: Dictionary<V> = {};
    arr.forEach((v, i) => (map[key(v, i, arr)] = v));
    return map;
}

export function Compare<T>(a: T, b: T): number {
    return a < b ? -1 : a > b ? 1 : 0;
}

type SortByParam_t<T> = keyof T | ((value: T) => string | number);
export function SortBy<T>(values: T[], ...orderParams: SortByParam_t<T>[]): void {
    values.sort((a, b) => {
        for (const orderParam of orderParams) {
            let result: number;
            if (typeof orderParam === 'function') {
                result = Compare(orderParam(a), orderParam(b));
            } else {
                result = Compare(a[orderParam], b[orderParam]);
            }
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });
}
