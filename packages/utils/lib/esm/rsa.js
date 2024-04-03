import { JSEncrypt as Encrypt } from 'jsencrypt';
import { getRandomStr } from './string';
export var JSEncrypt = Encrypt;
var RSA = /** @class */ (function () {
    function RSA(publicKey) {
        this.keyCodeMap = {};
        this.encryptor = new Encrypt();
        this.encryptor.setPublicKey("-----BEGIN PUBLIC KEY-----\n".concat(publicKey, "\n-----END PUBLIC KEY-----"));
    }
    RSA.prototype.encrypt = function (message) {
        return this.encryptor.encrypt(message);
    };
    RSA.prototype.getKeyCode = function (length) {
        if (length === void 0) { length = 16; }
        var keyIv = { key: getRandomStr(length), iv: getRandomStr(length) };
        var code = this.encrypt("".concat(keyIv.key, ",").concat(keyIv.iv));
        if (code === false)
            return;
        this.keyCodeMap[code] = keyIv;
        return { key: keyIv, code: code };
    };
    RSA.prototype.getAESKey = function (aes) {
        if (!this.keyCodeMap[aes])
            return;
        var key = JSON.parse(JSON.stringify(this.keyCodeMap[aes]));
        Reflect.deleteProperty(this.keyCodeMap, aes);
        return key;
    };
    return RSA;
}());
export { RSA };
export default RSA;
