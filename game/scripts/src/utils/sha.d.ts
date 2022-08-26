/** @noSelfInFile */
declare namespace SHA {
    function md5(s: string): string;
    function sha1(s: string): string;
    function sha224(s: string): string;
    function sha256(s: string): string;
    function sha512_224(s: string): string;
    function sha512_256(s: string): string;
    function sha384(s: string): string;
    function sha512(s: string): string;
    function sha3_224(s: string): string;
    function sha3_256(s: string): string;
    function sha3_384(s: string): string;
    function sha3_512(s: string): string;
    function shake128(s: string): string;
    function shake256(s: string): string;
    function hmac(s: string): string;
    function hex2bin(s: string): string;
    function base642bin(s: string): string;
    function bin2base64(s: string): string;
}
