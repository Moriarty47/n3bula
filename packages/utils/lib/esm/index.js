import debounceFn from './debounce';
import throttleFn from './throttle';
/** @public */
export const debounce = debounceFn;
/** @public */
export const throttle = throttleFn;
/** @public */
export const getType = (thing) => Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();
/** @public */
export const isType = (thing, type) => getType(thing) === type.toLowerCase();
/** @public */
export const isNumber = (thing) => isType(thing, 'number');
/** @public */
export const isString = (thing) => isType(thing, 'string');
/** @public */
export const isBoolean = (thing) => isType(thing, 'boolean');
/** @public */
export const isBigInt = (thing) => isType(thing, 'bigint');
/** @public */
export const isSymbol = (thing) => isType(thing, 'symbol');
/** @public */
export const isNull = (thing) => isType(thing, 'null');
/** @public */
export const isUndefined = (thing) => isType(thing, 'undefined');
/** @public */
export const isNullable = (thing) => isNull(thing) || isUndefined(thing);
/** @public */
export const isPrimary = (thing) => {
    if (thing !== null && (typeof thing === 'object' || typeof thing === 'function'))
        return false;
    return true;
};
/** @public */
export const isArray = (thing) => isType(thing, 'array');
/** @public */
export const isFunction = (thing) => isType(thing, 'function');
/** @public */
export const isObject = (thing) => isType(thing, 'object');
/** @public */
export const capitalize = (str = '') => {
    if (!str)
        return '';
    const firstLetter = str.slice(0, 1) || '';
    const rest = str.slice(1);
    return String(firstLetter).toUpperCase() + rest;
};
/** @public */
export const decapitalize = (str = '') => {
    if (!str)
        return '';
    const firstLetter = str.slice(0, 1) || '';
    const rest = str.slice(1);
    return String(firstLetter).toLowerCase() + rest;
};
/** @public */
export const camel2kebab = (str = '') => {
    if (!str)
        return '';
    return (str || '')
        .replace(/([A-Z])(\w)/g, (_, p1, p2) => `-${p1.toLowerCase()}${p2}`)
        .replace(/_/gm, '-');
};
/** @public */
export const kebab2camel = (str = '') => {
    if (!str)
        return '';
    return (str || '')
        .replace(/[-_](\w)/g, (_, p1) => p1.toUpperCase());
};
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
/** @public */
export const simpleMerge = (source, object = {}) => {
    const merged = Object.assign({}, source);
    Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
            merged[key] = simpleMerge(source[key], object[key]);
            return;
        }
        merged[key] = (object[key] || source[key]);
    });
    return merged;
};
export default {
    getType,
    isType,
    isNumber,
    isString,
    isBoolean,
    isBigInt,
    isSymbol,
    isNull,
    isUndefined,
    isNullable,
    isPrimary,
    isArray,
    isObject,
    is32Bit,
    getCodePointLength,
    isAllSameChar,
    getCharLength,
    padStart,
    padEnd,
    padStartEnd,
    emptyPadStart,
    simpleMerge,
    debounce: debounceFn,
    throttle: throttleFn,
};
//# sourceMappingURL=index.js.map