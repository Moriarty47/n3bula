import Crypto from 'crypto-js';

export const CryptoJS = Crypto;
export const CryptoMode = Crypto.mode;
export const CryptoPad = Crypto.pad;

type Options = {
  mode: typeof Crypto.mode.CBC;
  padding: typeof Crypto.pad.Pkcs7;
  [key: string]: any;
};

const defaultOptions: Options = {
  mode: CryptoMode.CBC,
  padding: CryptoPad.Pkcs7,
};

function encAES(message: string, key: string, iv: string, options: Options = defaultOptions) {
  return Crypto.AES
    .encrypt(message, Crypto.enc.Utf8.parse(key), {
      iv: Crypto.enc.Utf8.parse(iv),
      ...options,
    })
    .toString();
}

function decAES(message: string, key: string, iv: string, options: Options = defaultOptions) {
  return Crypto.AES
    .decrypt(message, Crypto.enc.Utf8.parse(key), {
      iv: Crypto.enc.Utf8.parse(iv),
      ...options,
    })
    .toString(Crypto.enc.Utf8);
}

export const AES = { en: encAES, de: decAES };

function enBase64(message: string) {
  return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(message));
}

function deBase64(message: string) {
  return Crypto.enc.Base64.parse(message).toString(Crypto.enc.Utf8);
}

export const Base64 = { en: enBase64, de: deBase64 };

export function SHA256(message: string, cfg?: object) {
  return Crypto.SHA256(message, cfg).toString();
}

export function MD5(message: string, cfg?: object) {
  return Crypto.MD5(message, cfg).toString();
}
