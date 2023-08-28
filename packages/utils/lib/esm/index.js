/** @public */
export const getType = (thing) => Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();
/** @public */
export const isType = (thing, type) => getType(thing) === type.toLowerCase();
/** @public */
export const isNumber = (thing) => isType(thing, 'number');
/** @public */
export const isString = (thing) => isType(thing, 'string');
/** @public */
export const isSymbol = (thing) => isType(thing, 'symbol');
/** @public */
export const isArray = (thing) => isType(thing, 'array');
/** @public */
export const isObject = (thing) => isType(thing, 'object');
/** @public */
export const isNullable = (thing) => isType(thing, 'null') || isType(thing, 'undefined');
/** @public */
export const is32Bit = (char, i) => {
    return char.codePointAt(i) > 0xffff;
};
/** @public */
export const getCodePointLength = (str) => {
    let len = 0;
    for (let i = 0, strLen = str.length; i < strLen; i += 1) {
        if (is32Bit(str, i))
            i++;
        len++;
    }
    return len;
};
/** @public */
export const isAllSameChar = (str, char) => {
    return new RegExp(`^(${char})\\1*$`).test(str);
};
/** @public */
export const getCharLength = (str) => {
    return str.replace(/[^\x00-\xff]/g, '  ').length;
};
/** @public */
export const padStart = (str, length, char) => {
    const strLen = getCodePointLength(str);
    const padding = char.repeat(Math.max(0, length - strLen));
    return padding + str;
};
/** @public */
export const padEnd = (str, length, char) => {
    const strLen = getCodePointLength(str);
    const padding = char.repeat(Math.max(0, length - strLen));
    return str + padding;
};
/** @public */
export const padStartEnd = (str, length, char1 = '', char2 = char1) => {
    const strLen = getCodePointLength(str);
    const paddingLen = Math.max(0, length - strLen);
    const leftPadingLen = Math.floor(paddingLen / 2);
    const rightPadingLen = paddingLen - leftPadingLen;
    return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};
/** @public */
export const emptyPadStart = (length, str = '', pad = '') => {
    return padStart(str, length, pad);
};
export default {
    getType,
    isType,
    isNumber,
    isString,
    isArray,
    isObject,
    isNullable,
    is32Bit,
    getCodePointLength,
    isAllSameChar,
    getCharLength,
    padStart,
    padEnd,
    padStartEnd,
    emptyPadStart,
};
//# sourceMappingURL=index.js.map