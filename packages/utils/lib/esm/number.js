export var isInt32 = function (value) { return value === (value | 0); };
export var isUint32 = function (value) { return value === (value >>> 0); };
export var validateInt32 = function (value) {
    return !(value < -2147483648 || value > 2147483647);
};
export var validateUint32 = function (value) {
    return !(value < 0 || value > 4294967295);
};
