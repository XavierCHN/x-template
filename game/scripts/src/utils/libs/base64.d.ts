interface Base64Encoder {
    [key: number]: number;
}

interface Base64Decoder {
    [key: number]: number;
}

declare namespace base64 {
    /**
     * 创建一个 Base64 编码器
     * @param s62 第 62 个字符，默认为 '+'
     * @param s63 第 63 个字符，默认为 '/'
     * @param spad 填充字符，默认为 '='
     * @returns Base64 编码器对象
     */
    function makeencoder(this: void, s62?: string, s63?: string, spad?: string): Base64Encoder;

    /**
     * 创建一个 Base64 解码器
     * @param s62 第 62 个字符，默认为 '+'
     * @param s63 第 63 个字符，默认为 '/'
     * @param spad 填充字符，默认为 '='
     * @returns Base64 解码器对象
     */
    function makedecoder(this: void, s62?: string, s63?: string, spad?: string): Base64Decoder;

    /**
     * 对字符串进行 Base64 编码
     * @param str 要编码的字符串
     * @param encoder Base64 编码器，默认为默认编码器
     * @param usecaching 是否使用缓存，默认为 false
     * @returns 编码后的 Base64 字符串
     */
    function encode(this: void, str: string, encoder?: Base64Encoder, usecaching?: boolean): string;

    /**
     * 对 Base64 字符串进行解码
     * @param b64 要解码的 Base64 字符串
     * @param decoder Base64 解码器，默认为默认解码器
     * @param usecaching 是否使用缓存，默认为 false
     * @returns 解码后的原始字符串
     */
    function decode(this: void, b64: string, decoder?: Base64Decoder, usecaching?: boolean): string;
}
