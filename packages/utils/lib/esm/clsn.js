function toValue(cls) {
    var temp;
    var str = '';
    if (typeof cls === 'string' || typeof cls === 'number') {
        str += cls;
    }
    else if (Array.isArray(cls)) {
        for (var i = 0, len = cls.length; i < len; i += 1) {
            if (cls[i]) {
                if (temp = toValue(cls[i])) {
                    str && (str += ' ');
                    str += temp;
                }
            }
        }
    }
    else {
        for (temp in cls) {
            if (cls[temp]) {
                str && (str += ' ');
                str += temp;
            }
        }
    }
    return str;
}
export function clsn() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    var temp;
    var str = '';
    for (var i = 0, len = rest.length; i < len; i += 1) {
        if (rest[i]) {
            if (temp = toValue(rest[i])) {
                str && (str += ' ');
                str += temp;
            }
        }
    }
    return str;
}
;
export default clsn;
