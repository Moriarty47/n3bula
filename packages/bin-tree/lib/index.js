(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BinTree"] = factory();
	else
		root["BinTree"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ src; }
});

;// CONCATENATED MODULE: ../utils/lib/esm/root.js
var theGlobal = typeof __webpack_require__.g === 'object'
    && __webpack_require__.g !== null
    && __webpack_require__.g.Object === Object
    && __webpack_require__.g;
var theGlobalThis = typeof globalThis === 'object'
    && globalThis !== null
    && globalThis.Object === Object
    && globalThis;
/* harmony default export */ const esm_root = (theGlobalThis || theGlobal || Function('return this')());

;// CONCATENATED MODULE: ../utils/lib/esm/path.js
/** char code of forward slash '/' */
var CHAR_FORWARD_SLASH = 47;
/** char code of dot '.' */
var CHAR_DOT = 46;
// @ts-ignore
var process;
// @ts-ignore
if (typeof process === 'undefined') {
    process = {
        cwd: function () { return '/'; }
    };
}
var charCodeAt = function (str, index) {
    return String.prototype.charCodeAt.call(str, index);
};
var lastIndexOf = function (str, searchString) {
    return String.prototype.lastIndexOf.call(str, searchString);
};
var slice = function (str, start, end) {
    return String.prototype.slice.call(str, start, end);
};
var isCharDot = function (code) { return code === CHAR_DOT; };
var isPosixPathSeparator = function (code) { return code === CHAR_FORWARD_SLASH; };
function assertPath(path) {
    var pathType = typeof path;
    if (pathType !== 'string') {
        throw new TypeError("Path must be a string. Received [".concat(pathType, "]"));
    }
}
/**
 * Resolve elements '.' and '..' in a path with directory names
 */
function normalizeStringPosix(path, allowAboveRoot) {
    var res = '';
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code = 0;
    for (var i = 0; i <= path.length; i++) {
        if (i < path.length) {
            code = charCodeAt(path, i);
        }
        else if (isPosixPathSeparator(code)) {
            break;
        }
        else {
            code = CHAR_FORWARD_SLASH;
        }
        if (isPosixPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {
                // NOOP
            }
            else if (dots === 2) {
                if ((res.length < 2) || lastSegmentLength !== 2 ||
                    !isCharDot(charCodeAt(res, res.length - 1)) ||
                    !isCharDot(charCodeAt(res, res.length - 2))) {
                    if (res.length > 2) {
                        var lastSlashIndex = lastIndexOf(res, '/');
                        if (lastSlashIndex === -1) {
                            res = '';
                            lastSegmentLength = 0;
                        }
                        else {
                            res = slice(res, 0, lastSlashIndex);
                            lastSegmentLength =
                                res.length - 1 - lastIndexOf(res, '/');
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                    else if (res.length !== 0) {
                        res = '';
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    res += res.length > 0 ? "/.." : '..';
                    lastSegmentLength = 2;
                }
            }
            else {
                if (res.length > 0) {
                    res += "/".concat(slice(path, lastSlash + 1, i));
                }
                else {
                    res = slice(path, lastSlash + 1, i);
                }
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        }
        else if (isCharDot(code) && dots !== -1) {
            dots++;
        }
        else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep, pathObject) {
    if (pathObject === void 0) { pathObject = {}; }
    var dir = pathObject.dir || pathObject.root;
    var base = pathObject.base ||
        "".concat(pathObject.name || '').concat(pathObject.ext || '');
    if (!dir)
        return base;
    return dir === pathObject.root ? "".concat(dir).concat(base) : "".concat(dir).concat(sep).concat(base);
}
function resolve() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    var resolvedPath = '';
    var resolvedAbsolute = false;
    for (var i = rest.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path_1 = i >= 0 ? rest[i] : process.cwd();
        assertPath(path_1);
        if (path_1.length === 0)
            continue;
        resolvedPath = "".concat(path_1, "/").concat(resolvedPath);
        resolvedAbsolute = isPosixPathSeparator(charCodeAt(path_1, 0));
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    if (resolvedAbsolute) {
        return "/".concat(resolvedPath);
    }
    return resolvedPath.length > 0 ? resolvedPath : '.';
}
function normalize(path) {
    assertPath(path);
    if (path.length === 0)
        return '.';
    var isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
    var trailingSeparator = isPosixPathSeparator(charCodeAt(path, path.length - 1));
    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0) {
        if (isAbsolute)
            return '/';
        return trailingSeparator ? './' : '.';
    }
    if (trailingSeparator) {
        path += '/';
    }
    return isAbsolute ? "/".concat(path) : path;
}
function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && isPosixPathSeparator(charCodeAt(path, 0));
}
function join() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    if (rest.length === 0)
        return '.';
    var joined;
    for (var i = 0; i < rest.length; i++) {
        var arg = rest[i];
        assertPath(arg);
        if (arg.length > 0) {
            joined = joined === undefined ? arg : (joined += "/".concat(arg));
        }
    }
    if (joined === undefined)
        return '.';
    return normalize(joined);
}
function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to)
        return '';
    // Trim leading forward slashes.
    from = resolve(from);
    to = resolve(to);
    if (from === to)
        return '';
    var fromStart = 1;
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;
    var toStart = 1;
    var toLen = to.length - toStart;
    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i < length; i++) {
        var fromCode = charCodeAt(from, fromStart + i);
        if (fromCode !== charCodeAt(to, toStart + i)) {
            break;
        }
        else if (isPosixPathSeparator(fromCode)) {
            lastCommonSep = i;
        }
    }
    if (i === length) {
        if (toLen > length) {
            if (isPosixPathSeparator(charCodeAt(to, toStart + i))) {
                // We get here if `from` is the exact base path for `to`.
                // For example: from='/foo/bar'; to='/foo/bar/baz'
                return slice(to, toStart + i + 1);
            }
            if (i === 0) {
                // We get here if `from` is the root
                // For example: from='/'; to='/foo'
                return slice(to, toStart + i);
            }
        }
        else if (fromLen > length) {
            if (isPosixPathSeparator(charCodeAt(from, fromStart + i))) {
                // We get here if `to` is the exact base path for `from`.
                // For example: from='/foo/bar/baz'; to='/foo/bar'
                lastCommonSep = i;
            }
            else if (i === 0) {
                // We get here if `to` is the root.
                // For example: from='/foo/bar'; to='/'
                lastCommonSep = 0;
            }
        }
    }
    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`.
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; i++) {
        if (i === fromEnd ||
            isPosixPathSeparator(charCodeAt(from, i))) {
            out += out.length === 0 ? '..' : '/..';
        }
    }
    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts.
    return "".concat(out).concat(slice(to, toStart + lastCommonSep));
}
;
function toNamespacedPath(path) {
    // Non-op on posix systems
    return path;
}
;
function dirname(path) {
    assertPath(path);
    if (path.length === 0)
        return '.';
    var hasRoot = isPosixPathSeparator(charCodeAt(path, 0));
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; i--) {
        if (isPosixPathSeparator(charCodeAt(path, i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        }
        else {
            // We saw the first non-path separator
            matchedSlash = false;
        }
    }
    if (end === -1)
        return hasRoot ? '/' : '.';
    if (hasRoot && end === 1)
        return '//';
    return slice(path, 0, end);
}
;
function basename(path, suffix) {
    if (suffix !== undefined) {
        assertPath(suffix);
    }
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    if (suffix !== undefined && suffix.length > 0 && suffix.length <= path.length) {
        if (suffix === path)
            return '';
        var extIdx = suffix.length - 1;
        var firstNonSlashEnd = -1;
        for (var i = path.length - 1; i >= 0; i--) {
            var code = charCodeAt(path, i);
            if (isPosixPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            }
            else {
                if (firstNonSlashEnd === -1) {
                    // We saw the first non-path separator, remember this index in case
                    // we need it if the extension ends up not matching
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    // Try to match the explicit extension
                    if (code === charCodeAt(suffix, extIdx)) {
                        if (--extIdx == -1) {
                            // We matched the extension, so mark this as the end of our path
                            // component
                            end = i;
                        }
                    }
                    else {
                        // Extension does not match, so our result is the entire path
                        // component
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) {
            end = firstNonSlashEnd;
        }
        else if (end === -1) {
            end = path.length;
        }
        return slice(path, start, end);
    }
    for (var i = path.length - 1; i >= 0; i--) {
        if (isPosixPathSeparator(charCodeAt(path, i))) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                start = i + 1;
                break;
            }
        }
        else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
        }
    }
    if (end === -1)
        return '';
    return slice(path, start, end);
}
;
function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; i--) {
        var code = charCodeAt(path, i);
        if (isPosixPathSeparator(code)) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
        }
        if (isCharDot(code)) {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1) {
                startDot = i;
            }
            else if (preDotState !== 1) {
                preDotState = 1;
            }
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 &&
            startDot === end - 1 &&
            startDot === startPart + 1)) {
        return '';
    }
    return slice(path, startDot, end);
}
;
function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
        throw new TypeError("Paramter \"pathObject\" must be an object, not ".concat(typeof pathObject));
    }
    return _format('/', pathObject);
}
;
function parse(path) {
    assertPath(path);
    var ret = { ext: '', dir: '', root: '', base: '', name: '' };
    if (path.length === 0)
        return ret;
    var isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
    var start;
    if (isAbsolute) {
        ret.root = '/';
        start = 1;
    }
    else {
        start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    // Get non-dir info
    for (; i >= start; i--) {
        var code = charCodeAt(path, i);
        if (isPosixPathSeparator(code)) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
        }
        if (isCharDot(code)) {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1) {
                startDot = i;
            }
            else if (preDotState !== 1) {
                preDotState = 1;
            }
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (end !== -1) {
        var start_1 = startPart === 0 && isAbsolute ? 1 : startPart;
        if (startDot === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 &&
                startDot === end - 1 &&
                startDot === startPart + 1)) {
            ret.base = ret.name = slice(path, start_1, end);
        }
        else {
            ret.name = slice(path, start_1, startDot);
            ret.base = slice(path, start_1, end);
            ret.ext = slice(path, startDot, end);
        }
    }
    if (startPart > 0) {
        ret.dir = slice(path, 0, startPart - 1);
    }
    else if (isAbsolute) {
        ret.dir = '/';
    }
    return ret;
}
;
var sep = '/';
var delimiter = ':';
var posix = null;
var path = {
    sep: sep,
    delimiter: delimiter,
    posix: posix,
    join: join,
    parse: parse,
    format: format,
    resolve: resolve,
    dirname: dirname,
    extname: extname,
    basename: basename,
    relative: relative,
    normalize: normalize,
    isAbsolute: isAbsolute,
    toNamespacedPath: toNamespacedPath,
    // Legacy internal API, deprecated.
    _makeLong: toNamespacedPath,
};
/* harmony default export */ const esm_path = ((/* unused pure expression or super */ null && (path)));

;// CONCATENATED MODULE: ../utils/lib/esm/debounce.js


function debounce_debounce(func, delay, options) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function.');
    }
    var result, timerId, lastArgs, lastThis, lastCallTime;
    var leading = false;
    var trailing = true;
    var maxing = false;
    var maxDelay = 0;
    var lastInvokeTime = 0;
    if (isObject(options)) {
        leading = !!options.leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
        maxing = 'maxWait' in options;
        maxDelay = maxing ? Math.max(options.maxDelay || 0, delay) : maxDelay;
    }
    var useRAF = (!delay && delay !== 0 && typeof root.requestAnimationFrame === 'function');
    function invokeFunc(time) {
        var args = lastArgs;
        var thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function startTimer(pendingFunc, delay) {
        if (useRAF) {
            root.cancelAnimationFrame(timerId);
            return root.requestAnimationFrame(pendingFunc);
        }
        return setTimeout(pendingFunc, delay);
    }
    function cancelTimer(id) {
        if (useRAF) {
            return root.cancelAnimationFrame(id);
        }
        return clearTimeout(id);
    }
    function remainingDelay(time) {
        var timeSinceLastCall = time - lastCallTime;
        var timeSinceLastInvoke = time - lastInvokeTime;
        var timeDelaying = delay - timeSinceLastCall;
        return maxing
            ? Math.min(timeDelaying, maxDelay - timeSinceLastInvoke)
            : timeDelaying;
    }
    function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime;
        var timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === undefined || timeSinceLastCall >= delay)
            || (timeSinceLastCall < 0)
            || (maxing && timeSinceLastInvoke >= maxDelay);
    }
    function timerExpired() {
        var time = Date.now();
        if (shouldInvoke(time))
            return trailingEdge(time);
        timerId = startTimer(timerExpired, remainingDelay(time));
    }
    function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = startTimer(timerExpired, delay);
        return leading ? invokeFunc(time) : result;
    }
    function trailingEdge(time) {
        timerId = undefined;
        if (trailing && lastArgs)
            return invokeFunc(time);
        lastArgs = lastThis = undefined;
        return result;
    }
    function cancel() {
        if (timerId !== undefined) {
            cancelTimer(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }
    function pending() {
        return timerId !== undefined;
    }
    function debounced() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var time = Date.now();
        var isInvoking = shouldInvoke(time);
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                timerId = startTimer(timerExpired, delay);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = startTimer(timerExpired, delay);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
}

;// CONCATENATED MODULE: ../utils/lib/esm/throttle.js


function throttle(func, delay, options) {
    var leading = true;
    var trailing = true;
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function.');
    }
    if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, delay, {
        leading: leading,
        trailing: trailing,
        maxDelay: delay
    });
}
;

;// CONCATENATED MODULE: ../utils/lib/esm/is.js
var getType = function (thing) {
    return Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();
};
var isType = function (thing, type) {
    return getType(thing) === type.toLowerCase();
};
var is_isNumber = function (thing) { return isType(thing, 'number'); };
var is_isString = function (thing) { return isType(thing, 'string'); };
var isBoolean = function (thing) { return isType(thing, 'boolean'); };
var isBigInt = function (thing) { return isType(thing, 'bigint'); };
var isSymbol = function (thing) { return isType(thing, 'symbol'); };
var isNull = function (thing) { return isType(thing, 'null'); };
var isUndefined = function (thing) { return isType(thing, 'undefined'); };
var is_isNullable = function (thing) { return isNull(thing) || isUndefined(thing); };
var isPrimary = function (thing) {
    if (thing !== null && (typeof thing === 'object' || typeof thing === 'function'))
        return false;
    return true;
};
var isArray = function (thing) { return isType(thing, 'array'); };
var isFunction = function (thing) { return isType(thing, 'function'); };
var is_isObject = function (thing) { return isType(thing, 'object'); };

;// CONCATENATED MODULE: ../utils/lib/esm/string.js
var capitalize = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    var firstLetter = str.slice(0, 1) || '';
    var rest = str.slice(1);
    return String(firstLetter).toUpperCase() + rest;
};
var decapitalize = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    var firstLetter = str.slice(0, 1) || '';
    var rest = str.slice(1);
    return String(firstLetter).toLowerCase() + rest;
};
var camel2kebab = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    return (str || '')
        .replace(/([A-Z])(\w)/g, function (_, p1, p2) { return "-".concat(p1.toLowerCase()).concat(p2); })
        .replace(/_/gm, '-');
};
var kebab2camel = function (str) {
    if (str === void 0) { str = ''; }
    if (!str)
        return '';
    return (str || '')
        .replace(/[-_](\w)/g, function (_, p1) { return p1.toUpperCase(); });
};
var is32Bit = function (char, i) {
    return char.codePointAt(i) > 0xffff;
};
var getCodePointLength = function (str) {
    var len = 0;
    for (var i = 0, strLen = str.length; i < strLen; i += 1) {
        if (is32Bit(str, i))
            i++;
        len++;
    }
    return len;
};
var isAllSameChar = function (str, char) {
    return new RegExp("^(".concat(char, ")\\1*$")).test(str);
};
var string_getCharLength = function (str) {
    return str.replace(/[^\x00-\xff]/g, '  ').length;
};
var padStart = function (str, length, char) {
    var strLen = getCodePointLength(str);
    var padding = char.repeat(Math.max(0, length - strLen));
    return padding + str;
};
var padEnd = function (str, length, char) {
    var strLen = getCodePointLength(str);
    var padding = char.repeat(Math.max(0, length - strLen));
    return str + padding;
};
var padStartEnd = function (str, length, char1, char2) {
    if (char1 === void 0) { char1 = ''; }
    if (char2 === void 0) { char2 = char1; }
    var strLen = getCodePointLength(str);
    var paddingLen = Math.max(0, length - strLen);
    var leftPadingLen = Math.floor(paddingLen / 2);
    var rightPadingLen = paddingLen - leftPadingLen;
    return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};
var emptyPadStart = function (length, str, pad) {
    if (str === void 0) { str = ''; }
    if (pad === void 0) { pad = ''; }
    return padStart(str, length, pad);
};

;// CONCATENATED MODULE: ../utils/lib/esm/merge.js
var __assign = (undefined && undefined.__assign) || function () {
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

var simpleMerge = function (source, object) {
    if (object === void 0) { object = {}; }
    var merged = __assign({}, source);
    Object.keys(source).forEach(function (key) {
        if (is_isObject(source[key])) {
            merged[key] = simpleMerge(source[key], object[key]);
            return;
        }
        merged[key] = (object[key] || source[key]);
    });
    return merged;
};

;// CONCATENATED MODULE: ../utils/lib/esm/index.js









;// CONCATENATED MODULE: ./src/utils.ts

var EMPTY_CHAR = ' ';
var HASH_CHAR = '#';
var NULL_CHAR = 'NULL';
function getTreeDepth(tree) {
  if (!tree) return 0;
  return Math.max(getTreeDepth(tree.left), getTreeDepth(tree.right)) + 1;
}
function levelOrderTraversal(tree) {
  var _a;
  var nodesArr = [];
  var queue = [tree];
  var treeDepth = getTreeDepth(tree);
  var nodesNum = Math.pow(2, treeDepth) - 1;
  var maxNumber = Number.MIN_SAFE_INTEGER;
  while (!queue.every(function (i) {
    return i === null;
  })) {
    var levelSize = queue.length;
    var levelNodes = [];
    for (var i = 0; i < levelSize; i += 1) {
      var node = queue.shift();
      var value = node ? (_a = node.value) !== null && _a !== void 0 ? _a : node.val : null;
      if (isNumber(value) && value > maxNumber) {
        maxNumber = value;
      } else if (isString(value)) {
        if (isNaN(value)) {
          var charLength = getCharLength(value);
          if (charLength > maxNumber) {
            maxNumber = charLength;
          }
        } else {
          value = Number(value);
          value > maxNumber && (maxNumber = value);
        }
      } else if (isNullable(value)) {
        value = NULL_CHAR;
      }
      levelNodes.push("".concat(value));
      queue.push((node === null || node === void 0 ? void 0 : node.left) || null);
      queue.push((node === null || node === void 0 ? void 0 : node.right) || null);
    }
    nodesArr.push(levelNodes);
  }
  return [nodesArr, treeDepth, nodesNum, maxNumber];
}
;// CONCATENATED MODULE: ./src/printer.ts


var defaults = {
  type: 'line',
  minLength: 2,
  marks: {
    dash: '━',
    lt: '┏',
    rt: '┓',
    lb: '┗',
    rb: '┛',
    joint: '┻'
  }
};
var SYMBOL_EMPTY = Symbol('Empty');
var SYMBOL_SLASH = Symbol('/');
var SYMBOL_BACKSLASH = Symbol('\\');
var SYMBOL_SPACE = Symbol('Space');
function binTreePrinter(tree, options) {
  if (options === void 0) {
    options = {};
  }
  var config = simpleMerge(defaults, options);
  if (config.type === 'slash') {
    return trianglePrint(tree, config);
  }
  return linePrint(tree, config);
  // return tableLinePrint(tree, config);
}
/**
 * @description
 * To draw like this, (n is level) , we have:
 * - width = 2^(n-1)-1
 * - height = 2^n-1
 * ```txt
 *             5
 *       ┏━━━━━┻━━━━━┓
 *       4···········6
 *    ┏━━┛···········┗━━┓
 *   211···············72
 *
 * ```
 */
function linePrint(tree, config) {
  var treeDepth = getTreeDepth(tree);
  var width = (2 << treeDepth - 1) - 1;
  var height = 2 * treeDepth - 1;
  var matrix = Array.from({
    length: height
  }, function () {
    return Array(width).fill(SYMBOL_SPACE);
  });
  var maxLength = Math.max(findMaxLength(tree), config.minLength);
  var props = {
    treeDepth: treeDepth,
    matrix: matrix,
    config: config,
    width: width,
    height: height,
    maxLength: maxLength
  };
  fillLineMatrix(tree, props, 0, (width - 1) / 2);
  return drawLineTree(matrix, width, height, maxLength);
}
function drawLineTree(matrix, width, height, maxLength) {
  var str = '';
  for (var i = 0; i < height; i += 1) {
    for (var j = 0; j < width; j += 1) {
      var char = matrix[i][j];
      if (char === SYMBOL_SPACE) {
        str += padStartEnd(EMPTY_CHAR, maxLength, EMPTY_CHAR);
      } else {
        str += padStartEnd("".concat(char), maxLength, EMPTY_CHAR);
      }
    }
    str += '\n';
  }
  return str;
}
function fillLineMatrix(tree, props, x,
// node position
y) {
  var cx = 0;
  var cLy = 0; // col
  var cRy = 0; // col
  if (tree) {
    cx = x + 1; // current node branch line
    props.matrix[x][y] = tree.val;
    if (tree.left && tree.right) {
      props.matrix[cx][y] = padStartEnd(props.config.marks.joint, props.maxLength, props.config.marks.dash);
    } else if (tree.left && !tree.right) {
      props.matrix[cx][y] = padStartEnd(props.config.marks.rb, props.maxLength, props.config.marks.dash, EMPTY_CHAR);
    } else if (!tree.left && tree.right) {
      props.matrix[cx][y] = padStartEnd(props.config.marks.lb, props.maxLength, EMPTY_CHAR, props.config.marks.dash);
    }
    var halfLineRange = Math.floor(Math.pow(2, props.treeDepth - 2 - x / 2));
    if (tree.left) {
      for (cLy = y - 1; cLy > y - halfLineRange; cLy -= 1) {
        props.matrix[cx][cLy] = props.config.marks.dash.repeat(props.maxLength);
      }
      props.matrix[cx][cLy] = padStartEnd(props.config.marks.lt, props.maxLength, EMPTY_CHAR, props.config.marks.dash);
    }
    if (tree.right) {
      for (cRy = y + 1; cRy < y + halfLineRange; cRy += 1) {
        props.matrix[cx][cRy] = props.config.marks.dash.repeat(props.maxLength);
      }
      props.matrix[cx][cRy] = padStartEnd(props.config.marks.rt, props.maxLength, props.config.marks.dash, EMPTY_CHAR);
    }
    cx += 1; // next node line
    fillLineMatrix(tree.left, props, cx, cLy);
    fillLineMatrix(tree.right, props, cx, cRy);
  }
}
function findMaxLength(tree) {
  var stack = [tree];
  var maxLength = 0;
  while (!stack.every(function (i) {
    return !i;
  })) {
    var node = stack.shift();
    if (node) {
      var valLen = getCodePointLength("".concat(node.val));
      if (maxLength < valLen) {
        maxLength = valLen;
      }
      stack.push(node.left, node.right);
    }
  }
  return maxLength % 2 === 1 ? maxLength : maxLength + 1;
}
/* ************************************************************************* */
/**
 *
 * @description
 * To draw like this, (n is level) , we have:
 * - width = (2^(n-1)-1)*3+2^(n-1) = 2^(n+1)-3
 * - height = 2^(n-1)
 * ```txt
 *         1
 *        /·\
 *       /···\
 *      /·····\
 *     2·······3
 *    /·\·····/·\
 *   4···5···6···7
 * ```
 * |char||function|
 * |:-|:-|:-|
 * |SYMBOL_SLASH||print '/'|
 * |SYMBOL_BACKSLASH||print '\'|
 * |SYMBOL_SPACE||print SPACE_CHAR|
 * |char||print char|
 */
function trianglePrint(tree, config) {
  var maxLength = preorderTraversal(tree).maxLength;
  var treeDepth = getTreeDepth(tree);
  var width = (2 << treeDepth) - 3;
  var height = (2 << treeDepth - 1) - 1;
  var matrix = Array.from({
    length: height
  }, function () {
    return Array(width).fill(SYMBOL_SPACE);
  });
  fillMatrix(tree, matrix, width, height, 0, (width - 1) / 2);
  console.log('maxLength', maxLength);
  console.log(matrix);
  return drawTriangleTree(matrix, width, height, maxLength);
}
function drawTriangleTree(matrix, width, height, maxLength) {
  var str = '';
  for (var i = 0; i < height; i += 1) {
    for (var j = 0; j < width; j += 1) {
      var char = matrix[i][j];
      var temp = void 0;
      if (char === SYMBOL_SLASH) {
        temp = padStartEnd('/', maxLength, EMPTY_CHAR);
      } else if (char === SYMBOL_BACKSLASH) {
        temp = padStartEnd('\\', maxLength, EMPTY_CHAR);
      } else if (char === SYMBOL_SPACE) {
        temp = padStartEnd(EMPTY_CHAR, maxLength, EMPTY_CHAR);
      } else if (!isSymbol(char)) {
        var ch = "".concat(char);
        temp = padStartEnd(ch, maxLength, EMPTY_CHAR);
      }
      str += temp;
    }
    str += '\n';
  }
  return str;
}
function caclHeightRange(x, y, height, direction) {
  return y + (direction === 'l' ? -1 : 1) * Math.floor((height - x + 1) / 2);
}
/**
 * @description
 * If tree node has children, the index should be y±(height-x+1)/2
 */
function fillMatrix(tree, matrix, width, height, x, y) {
  var cx = 0;
  var cy = 0;
  if (tree) {
    matrix[x][y] = tree.val;
    if (tree.left) {
      cx = x + 1;
      cy = y - 1;
      var rangeL = caclHeightRange(x, y, height, 'l');
      for (; cy > rangeL; cy -= 1, cx += 1) {
        matrix[cx][cy] = SYMBOL_SLASH;
      }
    }
    if (tree.right) {
      cx = x + 1;
      cy = y + 1;
      var rangeR = caclHeightRange(x, y, height, 'r');
      for (; cy < rangeR; cy += 1, cx += 1) {
        matrix[cx][cy] = SYMBOL_BACKSLASH;
      }
    }
    fillMatrix(tree.left, matrix, width, height, cx, caclHeightRange(x, y, height, 'l'));
    fillMatrix(tree.right, matrix, width, height, cx, caclHeightRange(x, y, height, 'r'));
  }
}
function preorderTraversal(tree) {
  var data = [];
  var stack = [tree];
  var maxLength = 0;
  while (!stack.every(function (i) {
    return !i;
  })) {
    var node = stack.shift();
    if (node) {
      var valLen = getCodePointLength("".concat(node.val));
      if (maxLength < valLen) {
        maxLength = valLen;
      }
      data.push(node.val);
      stack.push(node.left, node.right);
    } else {
      data.push(SYMBOL_EMPTY);
    }
  }
  return {
    maxLength: maxLength /* : maxLength % 2 === 1 ? maxLength : maxLength + 1 */,
    data: data
  };
}
;// CONCATENATED MODULE: ./src/creator.ts

var BinTreeNode = /** @class */function () {
  function BinTreeNode(value, left, right) {
    if (left === void 0) {
      left = null;
    }
    if (right === void 0) {
      right = null;
    }
    this.value = value;
    this.left = left;
    this.right = right;
  }
  Object.defineProperty(BinTreeNode.prototype, "val", {
    get: function get() {
      return this.value;
    },
    set: function set(val) {
      this.value = val;
    },
    enumerable: false,
    configurable: true
  });
  BinTreeNode.prototype.print = function (options) {
    return binTreePrinter(this, options);
  };
  BinTreeNode.prototype.getSize = function () {
    var _getSize = function _getSize(tree) {
      if (!tree) return 0;
      return 1 + _getSize(tree.left) + _getSize(tree.right);
    };
    return _getSize(this);
  };
  BinTreeNode.prototype.getLeafNodeSize = function () {
    var _getSize = function _getSize(tree) {
      if (!tree) return 0;
      if (!tree.left && !tree.right) return 1;
      return _getSize(tree.left) + _getSize(tree.right);
    };
    return _getSize(this);
  };
  BinTreeNode.prototype.getLevelNodeSize = function (n) {
    var _getSize = function _getSize(tree, m) {
      if (!tree || m <= 0) return 0;
      if (m === 1) return 1;
      return _getSize(tree.left, m - 1) + _getSize(tree.right, m - 1);
    };
    return _getSize(this, n);
  };
  BinTreeNode.prototype.getHeight = function () {
    return this.getDepth();
  };
  BinTreeNode.prototype.getDepth = function () {
    var _getDepth = function _getDepth(tree) {
      if (!tree) return 0;
      var leftTD = _getDepth(tree.left);
      var rightTD = _getDepth(tree.right);
      return 1 + Math.max(leftTD, rightTD);
    };
    return _getDepth(this);
  };
  BinTreeNode.prototype.isValidBST = function () {
    var isValid = function isValid(tree, left, right) {
      if (left === void 0) {
        left = -Infinity;
      }
      if (right === void 0) {
        right = Infinity;
      }
      if (!tree) return true;
      var val = tree.value;
      return left < val && val < right && isValid(tree.left, left, val) && isValid(tree.right, val, right);
    };
    return isValid(this);
  };
  BinTreeNode.prototype.find = function (data) {
    var _find = function _find(tree, val) {
      if (!tree || data === null) return null;
      if (tree.value === val) return tree;
      var res = _find(tree.left, val);
      if (res) return res;
      return _find(tree.right, val);
    };
    return _find(this, data);
  };
  BinTreeNode.prototype.findBottomEdgeNode = function (direction) {
    if (direction === void 0) {
      direction = 'l';
    }
    var queue = [this];
    var node;
    if (direction === 'l') {
      while (queue.length) {
        node = queue.shift();
        node.right && queue.push(node.right);
        node.left && queue.push(node.left);
      }
      return node.val;
    } else {
      while (queue.length) {
        node = queue.shift();
        node.left && queue.push(node.left);
        node.right && queue.push(node.right);
      }
      return node.val;
    }
  };
  BinTreeNode.prototype.deleteBSTNode = function (data) {
    if (this.isValidBST()) {
      var _delete_1 = function _delete_1(tree, val) {
        if (!tree || !val) return null;
        if (val > tree.val) {
          tree.right = _delete_1(tree.right, val);
        } else if (val < tree.val) {
          tree.left = _delete_1(tree.left, val);
        } else {
          if (!tree.left) return tree.right;
          if (!tree.right) return tree.left;
          var node = tree.right;
          while (node.left) {
            node = node.left;
          }
          node.left = tree.left;
          tree = tree.right;
        }
        return tree;
      };
      return _delete_1(this, data);
    }
    return 'Not a valid BST';
  };
  BinTreeNode.prototype.preorderTraversal = function () {
    var traversal = function traversal(node, treeData) {
      if (treeData === void 0) {
        treeData = [];
      }
      if (!node) return treeData;
      treeData.push(node.value);
      traversal(node.left, treeData);
      traversal(node.right, treeData);
      return treeData;
    };
    return traversal(this);
  };
  BinTreeNode.prototype.inorderTraversal = function () {
    var traversal = function traversal(node, treeData) {
      if (treeData === void 0) {
        treeData = [];
      }
      if (!node) return treeData;
      traversal(node.left, treeData);
      treeData.push(node.value);
      traversal(node.right, treeData);
      return treeData;
    };
    return traversal(this);
  };
  BinTreeNode.prototype.postorderTraversal = function () {
    var traversal = function traversal(node, treeData) {
      if (treeData === void 0) {
        treeData = [];
      }
      if (!node) return treeData;
      traversal(node.left, treeData);
      traversal(node.right, treeData);
      treeData.push(node.value);
      return treeData;
    };
    return traversal(this);
  };
  BinTreeNode.prototype.levelorderTraversal = function () {
    var treeData = [];
    var queue = [this];
    while (queue.length) {
      var level = [];
      var levelSize = queue.length;
      for (var i = 0; i < levelSize; i += 1) {
        var node = queue.shift();
        if (node) {
          level.push(node.value);
          node.left && queue.push(node.left);
          node.right && queue.push(node.right);
        }
      }
      treeData.push(level);
    }
    return treeData;
  };
  return BinTreeNode;
}();

function create(treeData) {
  var genTree = function genTree(arr, idx) {
    if (arr === void 0) {
      arr = [];
    }
    if (idx === void 0) {
      idx = 0;
    }
    if (arr.length === 0) return new BinTreeNode(null, null, null);
    if (idx > arr.length) return null;
    var left = 2 * idx + 1;
    var right = 2 * idx + 2;
    if (arr[idx] === undefined && arr[left] === undefined && arr[right] === undefined) {
      return null;
    }
    return new BinTreeNode(arr[idx] === undefined ? null : arr[idx], arr[left] || arr[left] === 0 ? genTree(arr, left) : undefined, arr[right] || arr[right] === 0 ? genTree(arr, right) : undefined);
  };
  return genTree(treeData);
}
function splitTree(tree) {
  if (!tree) return -1;
  return {
    root: tree,
    L: tree.left,
    R: tree.right
  };
}
function print() {
  var rest = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    rest[_i] = arguments[_i];
  }
  return binTreePrinter.apply(void 0, rest);
}
var BinTree = {
  create: create,
  splitTree: splitTree,
  print: print
};
/* harmony default export */ const creator = (BinTree);
;// CONCATENATED MODULE: ./src/index.ts

/* harmony default export */ const src = (creator);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});