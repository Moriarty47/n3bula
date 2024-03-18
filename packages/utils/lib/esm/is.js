export var getType = function (thing) {
    return Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();
};
export var isType = function (thing, type) {
    return getType(thing) === type.toLowerCase();
};
export var isNumber = function (thing) { return isType(thing, 'number'); };
export var isString = function (thing) { return isType(thing, 'string'); };
export var isBoolean = function (thing) { return isType(thing, 'boolean'); };
export var isBigInt = function (thing) { return isType(thing, 'bigint'); };
export var isSymbol = function (thing) { return isType(thing, 'symbol'); };
export var isNull = function (thing) { return isType(thing, 'null'); };
export var isUndefined = function (thing) { return isType(thing, 'undefined'); };
export var isNullable = function (thing) { return isNull(thing) || isUndefined(thing); };
export var isPrimary = function (thing) {
    if (thing !== null && (typeof thing === 'object' || typeof thing === 'function'))
        return false;
    return true;
};
export var isArray = function (thing) { return isType(thing, 'array'); };
export var isFunction = function (thing) { return isType(thing, 'function'); };
export var isObject = function (thing) { return isType(thing, 'object'); };
