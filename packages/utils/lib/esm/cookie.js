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
// /(?![ ;])([^=]+)=([^;]+)/g
export default function useCookies(_a) {
    var _b = _a === void 0 ? {} : _a, options = _b.options, transformer = _b.transformer;
    if (typeof document === 'undefined' || typeof window === 'undefined')
        return;
    if (!window.navigator.cookieEnabled) {
        throw new Error('The browser does not support or is blocking cookies from being set.');
    }
    function read(value) {
        if (value[0] === '"') {
            value = value.slice(1, -1);
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    }
    function write(value) {
        return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
    }
    transformer = Object.freeze(__assign({ read: read, write: write }, transformer));
    var defaultOptions = Object.freeze(__assign({ path: '/' }, options));
    function set(name, value, options) {
        if (options === void 0) { options = {}; }
        if (typeof document === 'undefined')
            return;
        options = __assign(__assign({}, defaultOptions), options);
        if (typeof options.maxAge === 'number') {
            options.expires = new Date(Date.now() + options.maxAge * 1000);
        }
        else if (typeof options.expires === 'number') {
            options.expires = new Date(Date.now() + options.expires * 864e5);
        }
        else if (typeof options.expires === 'string') {
            options.expires = new Date(options.expires);
        }
        if (options.expires) {
            options.expires = options.expires.toUTCString();
        }
        name = encodeURIComponent(name)
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
            .replace(/[()]/g, escape);
        var serializedString = '';
        for (var attr in options) {
            if (Object.prototype.hasOwnProperty.call(options, attr)) {
                if (!(options[attr]))
                    continue;
                serializedString += "; ".concat(attr);
                if (options[attr] === true)
                    continue;
                serializedString += "=".concat(options[attr].split(';')[0]);
            }
        }
        return (document.cookie =
            "".concat(name, "=").concat(transformer.write(value)).concat(serializedString));
    }
    function getAll(cookies, result) {
        for (var i = 0, len = cookies.length; i < len; i += 1) {
            var cookieParts = cookies[i].split('=');
            var value = cookieParts.slice(1).join('=');
            try {
                var key = decodeURIComponent(cookieParts[0]);
                if (!(key in result)) {
                    result[key] = new Set();
                }
                result[key].add(transformer.read(value));
            }
            catch (_a) { }
        }
    }
    function get() {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        if (typeof document === 'undefined')
            return {};
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var result = {};
        if (names.length === 0) {
            getAll(cookies, result);
        }
        else {
            for (var i = 0, len = cookies.length; i < len; i += 1) {
                var cookieParts = cookies[i].split('=');
                var value = cookieParts.slice(1).join('=');
                try {
                    var key = decodeURIComponent(cookieParts[0]);
                    if (!names.includes(key))
                        continue;
                    if (!(key in result)) {
                        result[key] = new Set();
                    }
                    result[key].add(transformer.read(value));
                }
                catch (_a) { }
            }
        }
        for (var key in result) {
            result[key] = Array.from(result[key]);
        }
        return result;
    }
    function has(name) {
        return !!get(name);
    }
    function size() {
        if (typeof document === 'undefined')
            return 0;
        var allCookies = get();
        var res = 0;
        for (var key in allCookies) {
            res += allCookies[key].length;
        }
        return res;
    }
    return {
        has: has,
        set: set,
        get: get,
        size: size,
        delete: function (name, attributes) {
            set(name, '', __assign(__assign({}, attributes), { expires: -1 }));
        },
    };
}
