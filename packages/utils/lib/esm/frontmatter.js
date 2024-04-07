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
import yaml from 'js-yaml';
var optionalByteOrderMark = '\\ufeff?';
var platform = typeof process !== 'undefined' ? process.platform : '';
var isWin32 = platform === 'win32';
var regex = new RegExp("^(".concat(optionalByteOrderMark, "(= yaml =|---)$([\\s\\S]*?)^(?:\\2|\\.\\.\\.)\\s*$").concat(isWin32 ? '\\r?' : '', "(?:\\n)?)"), 'm');
var getBodyBegin = function (content, matched) {
    var start = 1;
    var pos = content.indexOf('\n');
    var offset = matched.index + matched[0].length;
    while (pos !== -1) {
        if (pos >= offset)
            return start;
        start++;
        pos = content.indexOf('\n', pos + 1);
    }
    return start;
};
var parse = function (content, options) {
    var matched = regex.exec(content);
    if (!matched)
        return {
            frontmatter: {},
            body: content,
            bodyBegin: 1,
        };
    var str = matched[matched.length - 1].replace(/^\s+|\s+$/g, '');
    var frontmatter = yaml.load(str, options);
    return {
        frontmatter: frontmatter,
        body: content.replace(matched[0], ''),
        bodyBegin: getBodyBegin(content, matched),
    };
};
export var extract = function (content, options) {
    if (options === void 0) { options = {}; }
    var _options = __assign({ json: true }, options);
    var line = content.split(/(\r?\n)/)[0];
    if (line && /= yaml =|---/.test(line)) {
        return parse(content, _options);
    }
    return {
        frontmatter: {},
        body: content,
        bodyBegin: 1,
    };
};
export var serialize = function (object, options) {
    var _options = __assign({ skipInvalid: true }, options);
    return yaml.dump(object, _options);
};
