import { JSEncrypt as Encrypt } from 'jsencrypt';

import { getRandomStr } from './string';

export const JSEncrypt = Encrypt;

export class RSA {
  keyCodeMap: Record<string, { key: string; iv: string }> = {};
  encryptor: Encrypt;
  constructor(publicKey: string) {
    this.encryptor = new Encrypt();
    this.encryptor.setPublicKey(
      `-----BEGIN PUBLIC KEY-----
${publicKey}
-----END PUBLIC KEY-----`,
    );
  }

  encrypt(message: string) {
    return this.encryptor.encrypt(message);
  }

  getKeyCode(length: number = 16) {
    const keyIv = { iv: getRandomStr(length), key: getRandomStr(length) };
    const code = this.encrypt(`${keyIv.key},${keyIv.iv}`);
    if (code === false) return;
    this.keyCodeMap[code] = keyIv;
    return { code, key: keyIv };
  }

  getAESKey(aes: string) {
    if (!this.keyCodeMap[aes]) return;
    const key = JSON.parse(JSON.stringify(this.keyCodeMap[aes]));
    Reflect.deleteProperty(this.keyCodeMap, aes);
    return key;
  }
}
