import Crypto from 'crypto-js';
export declare const CryptoJS: typeof Crypto;
export declare const CryptoMode: typeof Crypto.mode;
export declare const CryptoPad: typeof Crypto.pad;
type Options = {
    mode: typeof Crypto.mode.CBC;
    padding: typeof Crypto.pad.Pkcs7;
    [key: string]: any;
};
declare function encAES(message: string, key: string, iv: string, options?: Options): string;
declare function decAES(message: string, key: string, iv: string, options?: Options): string;
export declare const AES: {
    en: typeof encAES;
    de: typeof decAES;
};
declare function enBase64(message: string): string;
declare function deBase64(message: string): string;
export declare const Base64: {
    en: typeof enBase64;
    de: typeof deBase64;
};
export declare function SHA256(message: string, cfg?: object): string;
export declare function MD5(message: string, cfg?: object): string;
export {};
