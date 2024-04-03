export var capitalize = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    var firstLetter = str.slice(0, 1) || '';
    var rest = str.slice(1);
    return String(firstLetter).toUpperCase() + rest;
};
export var decapitalize = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    var firstLetter = str.slice(0, 1) || '';
    var rest = str.slice(1);
    return String(firstLetter).toLowerCase() + rest;
};
export var camel2kebab = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    return (str || '')
        .replace(/([A-Z])(\w)/g, function (_, p1, p2) { return "-".concat(p1.toLowerCase()).concat(p2); })
        .replace(/_/gm, '-');
};
export var kebab2camel = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    return (str || '')
        .replace(/[-_](\w)/g, function (_, p1) { return p1.toUpperCase(); });
};
export var is32Bit = function (char, i) {
    return char.codePointAt(i) > 0xffff;
};
export var getCodePointLength = function (str) {
    var len = 0;
    for (var i = 0, strLen = str.length; i < strLen; i += 1) {
        if (is32Bit(str, i))
            i++;
        len++;
    }
    return len;
};
export var isAllSameChar = function (str, char) {
    return new RegExp("^(".concat(char, ")\\1*$")).test(str);
};
export var getCharLength = function (str) {
    return str.replace(/[^\x00-\xff]/g, '  ').length;
};
export var padStart = function (str, length, char) {
    var strLen = getCodePointLength(str);
    var padding = char.repeat(Math.max(0, length - strLen));
    return padding + str;
};
export var padEnd = function (str, length, char) {
    var strLen = getCodePointLength(str);
    var padding = char.repeat(Math.max(0, length - strLen));
    return str + padding;
};
export var padStartEnd = function (str, length, char1, char2) {
    if (char1 === void 0) { char1 = ''; }
    if (char2 === void 0) { char2 = char1; }
    var strLen = getCodePointLength(str);
    var paddingLen = Math.max(0, length - strLen);
    var leftPadingLen = Math.floor(paddingLen / 2);
    var rightPadingLen = paddingLen - leftPadingLen;
    return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};
export var emptyPadStart = function (length, str, pad) {
    if (str === void 0) { str = ''; }
    if (pad === void 0) { pad = ''; }
    return padStart(str, length, pad);
};
export var getRandomStr = function (length) {
    var str = Math.random().toString(36).slice(2);
    if (str.length >= length)
        return str.slice(0, length);
    str += getRandomStr(length - str.length);
    return str;
};
