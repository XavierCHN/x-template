declare namespace LibDeflate {
    interface CompressConfigs {
        level: number;
        strategy: 'fixed' | 'dynamic' | 'huffman_only';
    }

    type CompressDictionary = object;

    /**
     * 使用原始 deflate 格式进行压缩。
     * @param input - 待压缩的字符串数据。
     * @param configs - 控制压缩的配置对象。若为 `undefined`，则使用默认配置。
     * @returns 一个包含两个元素的元组，第一个元素是压缩后的数据（字符串类型），第二个元素是输出末尾填充的位数（数值类型）。
     * 填充位数范围为 0 到 7（包含边界值），这意味着返回的压缩数据最后一个字节的高 `bits` 位是填充位，不影响解压缩。
     * 除非你想对压缩数据进行一些后处理，否则无需使用这个值。
     * @see CompressConfigs
     * @see LibDeflate.DecompressDeflate
     */
    function CompressDeflate(input: string, configs?: CompressConfigs): LuaMultiReturn<[string, number]>;

    /**
     * 使用预设字典以原始 deflate 格式进行压缩。
     * @param input - 待压缩的数据，类型为字符串。
     * @param dict - 由 `LibDeflate:CreateDictionary` 生成的预设字典，类型为对象。
     * @param configs - 控制压缩的配置对象，类型可以是对象或 `undefined`。若为 `undefined`，则使用默认配置。
     * @returns 一个包含两个元素的元组，第一个元素是压缩后的数据（字符串类型），第二个元素是输出末尾填充的位数（数值类型）。
     * 填充位数范围为 0 到 7（包含边界值），这意味着返回的压缩数据最后一个字节的高 `bits` 位是填充位，不影响解压缩。
     * 除非你想对压缩数据进行一些后处理，否则无需使用这个值。
     * @see CompressConfigs
     * @see LibDeflate.CreateDictionary
     * @see LibDeflate.DecompressDeflateWithDict
     */
    function CompressDeflateWithDict(input: string, dict: CompressDictionary, configs?: CompressConfigs): LuaMultiReturn<[string, number]>;

    /**
     * 使用 zlib 格式进行压缩。
     * @param input - 待压缩的数据，类型为字符串。
     * @param configs - 控制压缩的配置对象，类型可以是对象或 `undefined`。若为 `undefined`，则使用默认配置。
     * @returns 一个包含两个元素的元组，第一个元素是压缩后的数据（字符串类型），第二个元素是输出末尾填充的位数（数值类型），该值始终为 0。zlib 格式的压缩数据末尾从不包含填充位。
     * @see CompressConfigs
     * @see LibDeflate.DecompressZlib
     */
    function CompressZlib(input: string, configs?: CompressConfigs): LuaMultiReturn<[string, number]>;

    /**
     * 使用预设字典以 zlib 格式进行压缩。
     * @param input - 待压缩的数据，类型为字符串。
     * @param dict - 由 `LibDeflate.CreateDictionary` 生成的预设字典，类型为对象。
     * @param configs - 控制压缩的配置对象，若为 `undefined`，则使用默认配置。
     * @returns 一个包含两个元素的元组，第一个元素是压缩后的数据（字符串类型），第二个元素是输出末尾填充的位数（数值类型），该值始终为 0。zlib 格式的压缩数据末尾从不包含填充位。
     * @see CompressConfigs
     * @see LibDeflate.CreateDictionary
     * @see LibDeflate.DecompressZlibWithDict
     */
    function CompressZlibWithDict(input: string, dict: CompressDictionary, configs?: CompressConfigs): LuaMultiReturn<[string, number]>;

    /**
     * 解压缩原始 deflate 格式的压缩数据。
     * @param input - 待解压缩的数据，类型为字符串。
     * @returns 一个包含两个元素的元组，第一个元素是解压缩后的数据（字符串类型），若解压缩失败则为 `undefined`；第二个元素是输入压缩数据中未处理的字节数。
     * 若解压缩成功，当输入数据是有效压缩数据后追加任意非空字符串时，该返回值为正整数；若输入数据不包含额外字节，则返回 0。
     * 若解压缩失败（即该函数的第一个返回值为 `undefined`），则该返回值未定义。
     * @see LibDeflate.CompressDeflate
     */
    function DecompressDeflate(input: string): LuaMultiReturn<[string | undefined, number]>;

    /**
     * 使用预设字典解压缩原始 deflate 格式的压缩数据。
     * @param input - 待解压缩的数据，类型为字符串。
     * @param dict - 压缩数据生成时 `LibDeflate.CompressDeflateWithDict` 使用的预设字典。解压缩和压缩必须使用相同的字典，否则可能会生成错误的解压缩数据且不会产生任何错误。
     * @returns 一个包含两个元素的元组，第一个元素是解压缩后的数据（字符串类型），若解压缩失败则为 `undefined`；第二个元素是输入压缩数据中未处理的字节数。
     * 若解压缩成功，当输入数据是有效压缩数据后追加任意非空字符串时，该返回值为正整数；若输入数据不包含额外字节，则返回 0。
     * 若解压缩失败（即该函数的第一个返回值为 `undefined`），则该返回值未定义。
     * @see LibDeflate.CompressDeflateWithDict
     */
    function DecompressDeflateWithDict(input: string, dict: CompressDictionary): LuaMultiReturn<[string | undefined, number]>;

    /**
     * 解压缩 zlib 格式的压缩数据。
     * @param input - 待解压缩的数据，类型为字符串。
     * @returns 一个包含两个元素的元组，第一个元素是解压缩后的数据（字符串类型），若解压缩失败则为 `undefined`；第二个元素是输入压缩数据中未处理的字节数。
     * 若解压缩成功，当输入数据是有效压缩数据后追加任意非空字符串时，该返回值为正整数；若输入数据不包含额外字节，则返回 0。
     * 若解压缩失败（即该函数的第一个返回值为 `undefined`），则该返回值未定义。
     * @see LibDeflate.CompressZlib
     */
    function DecompressZlib(input: string): LuaMultiReturn<[string | undefined, number]>;

    /**
     * 使用预设字典解压缩 zlib 格式的压缩数据。
     * @param input - 待解压缩的数据，类型为字符串。
     * @param dict - 压缩数据生成时 `LibDeflate.CompressDeflateWithDict` 使用的预设字典。解压缩和压缩必须使用相同的字典，否则可能会生成错误的解压缩数据且不会产生任何错误。
     * @returns 一个包含两个元素的元组，第一个元素是解压缩后的数据（字符串类型），若解压缩失败则为 `undefined`；第二个元素是输入压缩数据中未处理的字节数。
     * 若解压缩成功，当输入数据是有效压缩数据后追加任意非空字符串时，该返回值为正整数；若输入数据不包含额外字节，则返回 0。
     * 若解压缩失败（即该函数的第一个返回值为 `undefined`），则该返回值未定义。
     * @see LibDeflate.CompressZlibWithDict
     */
    function DecompressZlibWithDict(input: string, dict: CompressDictionary): LuaMultiReturn<[string | undefined, number]>;

    /**
     * 计算字符串的 Adler-32 校验和。
     * 有关 Adler-32 校验和的定义，请参阅 RFC1950 第 9 页 https://tools.ietf.org/html/rfc1950。
     * @param input - 用于计算 Adler-32 校验和的输入字符串。
     * @returns Adler-32 校验和，该值大于等于 0 且小于 2^32 (4294967296)。
     */
    function Adler32(input: string): number;

    /**
     * 创建一个预设字典。
     *
     * 此函数运行速度不快，生成的字典内存消耗约为输入字符串的 50 倍。因此，建议在程序中仅运行此函数一次。
     *
     * 重要的是要知道，如果你使用预设字典，压缩器和解压缩器必须使用相同的字典。也就是说，字典必须使用相同的字符串创建。
     * 如果你用新字典更新程序，使用旧版本的用户将无法与使用新版本的用户传输数据。因此，更改字典必须非常谨慎。
     *
     * 参数 `strlen` 和 `adler32` 增加了一层验证，以确保参数 `str` 在程序开发过程中不会被意外修改。
     *
     * @example
     * local dict_str = "1234567890"
     * // print(dict_str:len(), LibDeflate:Adler32(dict_str))
     * // 硬编码以下打印结果以进行验证，避免在程序开发过程中意外修改 'str'。
     * // 字符串长度: 10, Adler-32: 187433486,
     * // 不要在运行时计算字符串长度及其 Adler-32 校验和。
     * local dict = LibDeflate:CreateDictionary(dict_str, 10, 187433486)
     *
     * @param preset - 用作预设字典的字符串。你应该将频繁出现的内容放入字典字符串中，并且最好将出现频率更高的内容放在字符串末尾。空字符串和长度超过 32768 字节的字符串是不允许的。
     * @param strlen - `preset` 的长度。请将此参数作为硬编码常量传入，以验证 `preset` 的内容。该参数的值应在程序运行前确定。
     * @param adler32 - `preset` 的 Adler-32 校验和。请将此参数作为硬编码常量传入，以验证 `preset` 的内容。该参数的值应在程序运行前确定。
     * @returns 用于预设字典压缩和解压缩的字典。
     * @throws 如果 `strlen` 与 `preset` 的长度不匹配，或者 `adler32` 与 `preset` 的 Adler-32 校验和不匹配，则会抛出错误。
     */
    function CreateDictionary(preset: string, strlen: number, adler32: number): CompressDictionary;

    /**
     * 将字符串编码为可打印格式。<br>
     * 此函数借鉴了 WeakAuras2 的实现，由 LibDeflate 的作者重写。<br>
     * 编码后的字符串长度将比原始字符串长 25%。不过，编码字符串的每个字节都将是 64 个可打印 ASCII 字符之一，
     * 这些字符更易于复制、粘贴和显示。（26 个小写字母、26 个大写字母、10 个数字、左括号或右括号）
     * @param {string} str 待编码的字符串。
     * @returns {string} 编码后的字符串。
     */
    function EncodeForPrint(input: string): string;

    /**
     * 解码由 `LibDeflate.EncodeForPrint` 生成的可打印字符串。
     * 在解码前，会移除 `str` 前后的控制字符或空格，因此如果 `str` 是用户复制粘贴而来且带有前后空格时，使用起来会更方便。
     * 如果字符串包含任何无法由 `LibDeflate.EncodeForPrint` 生成的字符，解码将会失败。
     * 也就是说，如果字符串包含的字符不是 26 个小写字母、26 个大写字母、10 个数字、左括号或右括号中的任何一个，解码就会失败。
     * @param {string} str 待解码的字符串。
     * @returns {string | undefined} 解码成功时返回解码后的字符串，失败时返回 `undefined`。
     */
    function DecodeForPrint(input: string): string;
}
