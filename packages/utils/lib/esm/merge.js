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
import { isObject } from './is';
export var simpleMerge = function (source, object) {
    if (object === void 0) { object = {}; }
    var merged = __assign({}, source);
    Object.keys(source).forEach(function (key) {
        if (isObject(source[key])) {
            merged[key] = simpleMerge(source[key], object[key]);
            return;
        }
        merged[key] = (object[key] || source[key]);
    });
    return merged;
};
