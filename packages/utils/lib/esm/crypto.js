var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Crypto from 'crypto-js';
export var CryptoJS = Crypto;
export var CryptoMode = Crypto.mode;
export var CryptoPad = Crypto.pad;
var defaultOptions = {
    mode: CryptoMode.CBC,
    padding: CryptoPad.Pkcs7,
};
function encAES(message, key, iv, options) {
    if (options === void 0) { options = defaultOptions; }
    return Crypto.AES
        .encrypt(message, Crypto.enc.Utf8.parse(key), __assign({ iv: Crypto.enc.Utf8.parse(iv) }, options))
        .toString();
}
function decAES(message, key, iv, options) {
    if (options === void 0) { options = defaultOptions; }
    return Crypto.AES
        .decrypt(message, Crypto.enc.Utf8.parse(key), __assign({ iv: Crypto.enc.Utf8.parse(iv) }, options))
        .toString(Crypto.enc.Utf8);
}
export var AES = { en: encAES, de: decAES };
function enBase64(message) {
    return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(message));
}
function deBase64(message) {
    return Crypto.enc.Base64.parse(message).toString(Crypto.enc.Utf8);
}
export var Base64 = { en: enBase64, de: deBase64 };
export function SHA256(message, cfg) {
    return Crypto.SHA256(message, cfg).toString();
}
export function MD5(message, cfg) {
    return Crypto.MD5(message, cfg).toString();
}
