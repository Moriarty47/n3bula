import { JSEncrypt as Encrypt } from 'jsencrypt';
export declare const JSEncrypt: typeof Encrypt;
export declare class RSA {
    keyCodeMap: Record<string, {
        key: string;
        iv: string;
    }>;
    encryptor: Encrypt;
    constructor(publicKey: string);
    encrypt(message: string): string | false;
    getKeyCode(length?: number): {
        key: {
            key: string;
            iv: string;
        };
        code: string;
    } | undefined;
    getAESKey(aes: string): any;
}
export default RSA;
