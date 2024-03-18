(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PrettyJson"] = factory();
	else
		root["PrettyJson"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src),
  loadCSS: () => (/* binding */ loadCSS),
  prettyJSONFormatter: () => (/* binding */ prettyJSONFormatter),
  render: () => (/* binding */ _render),
  toHTML: () => (/* binding */ toHTML),
  toText: () => (/* binding */ toText)
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
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
/**
 * Win32 methods have been removed to make this only useful for the browser.
 * Node path from [v16.20.2](https://github.com/nodejs/node/blob/v16.20.2)
 */
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
var isNumber = function (thing) { return isType(thing, 'number'); };
var isString = function (thing) { return isType(thing, 'string'); };
var isBoolean = function (thing) { return isType(thing, 'boolean'); };
var isBigInt = function (thing) { return isType(thing, 'bigint'); };
var isSymbol = function (thing) { return isType(thing, 'symbol'); };
var isNull = function (thing) { return isType(thing, 'null'); };
var isUndefined = function (thing) { return isType(thing, 'undefined'); };
var isNullable = function (thing) { return isNull(thing) || isUndefined(thing); };
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
var getCharLength = function (str) {
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









;// CONCATENATED MODULE: ./src/json.css
const json_namespaceObject = ".json-container {\r\n  font-family: menlo, consolas, monospace;\r\n  font-style: normal;\r\n  font-weight: bold;\r\n  line-height: 1.4em;\r\n  font-size: 0.9rem;\r\n  transition: background-color 100ms;\r\n}\r\n\r\na.json-link {\r\n  text-decoration: none;\r\n  border-bottom: 1px solid;\r\n  outline: none;\r\n}\r\n\r\na.json-link:hover {\r\n  background-color: transparent;\r\n  outline: none;\r\n}\r\n\r\nol.json-lines {\r\n  white-space: normal;\r\n  padding-inline-start: 3em;\r\n  margin: 0px;\r\n}\r\n\r\nol.json-lines>li {\r\n  white-space: pre;\r\n  text-indent: 0.7em;\r\n  line-height: 1.5em;\r\n  padding: 0px;\r\n}\r\n\r\nol.json-lines>li::marker {\r\n  font-family: system-ui, sans-serif;\r\n  font-weight: normal;\r\n}\r\n\r\n.json-normal {\r\n  font-weight: normal;\r\n}\r\n\r\n.json-italic {\r\n  font-style: italic;\r\n}\r\n\r\n.json-key,\r\n.json-string,\r\n.json-number,\r\n.json-boolean,\r\n.json-null,\r\n.json-mark,\r\na.json-link,\r\nol.json-lines>li {\r\n  transition: all 100ms;\r\n}\r\n\r\n.json-container {\r\n  color: #ffffff;\r\n}\r\n\r\n.json-key {\r\n  color: indianred;\r\n}\r\n\r\n.json-error {\r\n  color: #ED6C89;\r\n}\r\n\r\n.json-string {\r\n  color: khaki;\r\n}\r\n\r\n.json-number {\r\n  color: deepskyblue;\r\n}\r\n\r\n.json-array {\r\n  color: limegreen;\r\n}\r\n\r\n.json-object {\r\n  color: chocolate;\r\n}\r\n\r\n.json-boolean {\r\n  color: mediumseagreen;\r\n}\r\n\r\n.json-symbol {\r\n  color: #6AD1C7;\r\n}\r\n\r\n.json-function {\r\n  font-weight: bold;\r\n  color: silver;\r\n}\r\n\r\n.json-function-identifier {\r\n  color: #E59A6F;\r\n}\r\n\r\n.json-function-name {\r\n  color: #90DAE6;\r\n}\r\n\r\n.json-bigint {\r\n  color: #ABABAB;\r\n}\r\n\r\n.json-null {\r\n  color: darkorange;\r\n}\r\n\r\n.json-undefined {\r\n  color: silver;\r\n}\r\n\r\n.json-mark {\r\n  color: silver;\r\n}\r\n\r\na.json-link {\r\n  color: mediumorchid;\r\n}\r\n\r\na.json-link:visited {\r\n  color: slategray;\r\n}\r\n\r\na.json-link:hover {\r\n  color: violet;\r\n}\r\n\r\na.json-link:active {\r\n  color: slategray;\r\n}\r\n\r\nol.json-lines>li::marker {\r\n  color: silver;\r\n}\r\n\r\nol.json-lines>li:nth-child(odd) {\r\n  background-color: #222222;\r\n}\r\n\r\nol.json-lines>li:nth-child(even) {\r\n  background-color: #161616;\r\n}\r\n\r\nol.json-lines>li:hover {\r\n  background-color: dimgray;\r\n}";
;// CONCATENATED MODULE: ./src/index.ts

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }


var IS_CSS_LOADED = Symbol('is_CSS_Loaded');
var DOM_CACHE = new Map();
var loadCSS = function loadCSS() {
  if (typeof window === 'undefined') {
    throw new TypeError('Only useful for the browser.');
  }
  if (window && window[IS_CSS_LOADED]) return;
  var style = document.createElement('style');
  style.textContent = json_namespaceObject;
  document.head.appendChild(style);
  Object.defineProperty(window, IS_CSS_LOADED, {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });
};
var _render = function render(domID, content) {
  var dom;
  if (typeof domID === 'string') {
    dom = DOM_CACHE.get(domID) || document.getElementById(domID);
    DOM_CACHE.set(domID, dom);
  } else {
    dom = domID;
  }
  if (dom) {
    var pre = document.createElement('pre');
    pre.classList.add('json-container');
    pre.innerHTML = content;
    dom.appendChild(pre);
  }
};

var toHTML = function toHTML(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = prettyJSONFormatter(content, _objectSpread(_objectSpread({}, options), {}, {
    output: 'html'
  }));
  return {
    value: result,
    render: function render(domID) {
      _render(domID, result);
    }
  };
};
var toText = function toText(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = prettyJSONFormatter(content, _objectSpread(_objectSpread({}, options), {}, {
    output: 'text'
  }));
  return {
    value: result,
    render: function render(domID) {
      _render(domID, result);
    }
  };
};
var defaults = {
  output: 'html',
  indent: 2,
  quoteKeys: false,
  singleQuote: true,
  oneLineArray: false,
  trailingComma: true
};
var prettyJSONFormatter = function prettyJSONFormatter(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = simpleMerge(defaults, options);
  config.htmlMarks = presetMarks(config);
  if (isArray(content)) {
    if (config.oneLineArray) {
      if (hasArrayChildren(content)) {
        return flat2ArrayFormatter(content, config);
      } else {
        return flatArrayFormatter(content, config);
      }
    }
  }
  return mainFormatter(content, config);
};
loadCSS();
/* harmony default export */ const src = (prettyJSONFormatter);
var presetMarks = function presetMarks(options) {
  var isHTML = options.output === 'html';
  var typeMark = function typeMark(value, type) {
    return isHTML ? "<span class=\"json-".concat(type, "\">").concat(value, "</span>") : "".concat(value);
  };
  var QUOTE = options.singleQuote ? typeMark('\'', 'mark') : typeMark('"', 'mark');
  var LT = isHTML ? '&lt;' : '<';
  var GT = isHTML ? '&gt;' : '>';
  var STRING = function STRING(value) {
    return typeMark("".concat(QUOTE).concat(value).concat(QUOTE), 'string');
  };
  var OBJECTKEY = options.quoteKeys ? STRING : function (value) {
    return typeMark("".concat(value), 'string');
  };
  return {
    typeMark: typeMark,
    TAB: '\t',
    QUOTE: QUOTE,
    SPACE: isHTML ? '&nbsp;' : ' ',
    LINEBREAK: '\n',
    SEMI: typeMark(': ', 'mark'),
    ARROW: typeMark(' => ', 'mark'),
    COMMA: typeMark(',', 'mark'),
    ARRAYLT: typeMark('[', 'array'),
    ARRAYRT: typeMark(']', 'array'),
    OBJECTLT: typeMark('{', 'object'),
    OBJECTRT: typeMark('}', 'object'),
    NULL: typeMark('null', 'null'),
    UNDEFINED: typeMark('undefined', 'undefined'),
    CIRCULAR_ERROR: typeMark("".concat(LT, "Circular structure detected!").concat(GT), 'error'),
    DATE: function DATE(value) {
      return typeMark(value.toString(), 'mark');
    },
    ERROR: function ERROR(value) {
      return typeMark(value, 'error');
    },
    ITALIC: function ITALIC(value) {
      return typeMark(value, 'italic');
    },
    STRING: STRING,
    NUMBER: function NUMBER(value) {
      return typeMark("".concat(value), 'number');
    },
    SYMBOL: function SYMBOL(value) {
      return typeMark(value.toString(), 'symbol');
    },
    BIGINT: function BIGINT(value) {
      return typeMark("".concat(value.toString(), "n"), 'bigint');
    },
    BOOLEAN: function BOOLEAN(value) {
      return typeMark(value ? 'true' : 'false', 'boolean');
    },
    FUNCTION: function FUNCTION(value) {
      return typeMark(value, 'function');
    },
    OBJECTKEY: OBJECTKEY
  };
};
function isPrimaryObject(input) {
  return ['string', 'number', 'boolean'].includes(getType(input));
}
function hasArrayChildren(arr) {
  return arr.some(function (ar) {
    return isArray(ar);
  });
}
function findArrayMaxLength(arr) {
  var rowLen = arr.length;
  var colLen = arr[0].length;
  var maxLength = 0;
  for (var i = 0; i < rowLen; i += 1) {
    var row = arr[i];
    for (var j = 0; j < colLen; j += 1) {
      var ele = "".concat(row[j]);
      if (ele.length > maxLength) {
        maxLength = ele.length;
      }
    }
  }
  return maxLength;
}
function flatArrayFormatter(input, options) {
  var htmlMarks = options.htmlMarks;
  var rowLen = input.length;
  var str = '';
  str = "".concat(htmlMarks.ARRAYLT, " ");
  for (var i = 0; i < rowLen; i += 1) {
    var arrStr = mainFormatter(input[i], options);
    str += "".concat(arrStr).concat(i < rowLen - 1 ? htmlMarks.COMMA : '', " ");
  }
  str += "".concat(htmlMarks.ARRAYRT);
  return str;
}
function flat2ArrayFormatter(input, options) {
  var htmlMarks = options.htmlMarks,
    indent = options.indent,
    output = options.output;
  var rowLen = input.length;
  var str = '';
  if (output === 'html') {
    str = "".concat(htmlMarks.ARRAYLT).concat(htmlMarks.LINEBREAK);
    var convert = function convert(item) {
      if (typeof item === 'string') {
        return htmlMarks.STRING(item);
      }
      return htmlMarks.NUMBER(item);
    };
    for (var i = 0; i < rowLen; i += 1) {
      var arrStr = isArray(input[i]) ? "".concat(htmlMarks.ARRAYLT, " ").concat(input[i].map(convert).join(', '), " ").concat(htmlMarks.ARRAYRT) : mainFormatter(input[i], options, 2);
      str += "".concat(htmlMarks.SPACE.repeat(indent)).concat(arrStr).concat(htmlMarks.COMMA).concat(htmlMarks.LINEBREAK);
    }
    str += "".concat(htmlMarks.ARRAYRT).concat(htmlMarks.LINEBREAK);
  } else {
    var space = ' ';
    var gap = space.repeat(2);
    var colLen = input[0].length;
    var rowIdxLength = "".concat(rowLen).length;
    var maxLength = findArrayMaxLength(input);
    str = "".concat(padStart(space, rowIdxLength, space)).concat(gap).concat(Array.from({
      length: colLen
    }, function (_, i) {
      return padEnd('' + i, maxLength, space);
    }).join(gap)).concat(gap).concat(htmlMarks.LINEBREAK);
    for (var _i = 0; _i < rowLen; _i += 1) {
      var _arrStr = isArray(input[_i]) ? input[_i].map(function (item) {
        return padEnd('' + item, maxLength, space);
      }).join(gap) : mainFormatter(input[_i], options);
      str += "".concat(padStart('' + _i, rowIdxLength, space)).concat(gap).concat(_arrStr).concat(gap).concat(htmlMarks.LINEBREAK);
    }
  }
  return str;
}
function mainFormatter(input, options) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var cacheMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new WeakMap();
  var htmlMarks = options.htmlMarks;
  if (isPrimary(input)) {
    return primaryFormatter(input, options);
  }
  if (isFunction(input)) {
    return functionFormatter(input, options);
  }
  if (isPrimaryObject(input)) {
    return primaryObjectFormatter(input, options);
  }
  var type = getType(input);
  if (type === 'date') {
    return htmlMarks.DATE(input);
  }
  if (type === 'error') {
    return errorFormatter(input, options);
  }
  if (type === 'object') {
    return objectFormatter(input, options, level, cacheMap);
  }
  if (type === 'array') {
    return arrayFormatter(input, options, level, cacheMap);
  }
  if (type === 'map') {
    return mapFormatter(input, options, level, cacheMap);
  }
  return '';
}
function mapFormatter(input, options, level, cacheMap) {
  var htmlMarks = options.htmlMarks,
    indent = options.indent;
  if (cacheMap.has(input)) {
    return htmlMarks.CIRCULAR_ERROR;
  }
  cacheMap.set(input, true);
  var str = "".concat(htmlMarks.ITALIC('Map(' + input.size + ')'), " ").concat(htmlMarks.OBJECTLT).concat(htmlMarks.LINEBREAK);
  var entries = input.entries();
  var entry;
  while (entry = entries.next()) {
    if (entry.value) {
      var key = entry.value[0];
      var val = entry.value[1];
      str += "".concat(htmlMarks.SPACE.repeat(indent * level)).concat(mainFormatter(key, options, level + 1, cacheMap)).concat(htmlMarks.ARROW).concat(mainFormatter(val, options, level + 1, cacheMap));
    }
    if (entry.done) {
      break;
    } else {
      str += "".concat(htmlMarks.COMMA).concat(htmlMarks.LINEBREAK);
    }
  }
  str += "".concat(htmlMarks.SPACE.repeat(indent * (level - 1))).concat(htmlMarks.OBJECTRT);
  return str;
}
function arrayFormatter(input, options, level, cacheMap) {
  var htmlMarks = options.htmlMarks,
    indent = options.indent;
  if (cacheMap.has(input)) {
    return htmlMarks.CIRCULAR_ERROR;
  }
  cacheMap.set(input, true);
  var str = "".concat(htmlMarks.ARRAYLT).concat(htmlMarks.LINEBREAK);
  for (var i = 0, len = input.length; i < len; i += 1) {
    str += "".concat(htmlMarks.SPACE.repeat(indent * level)).concat(mainFormatter(input[i], options, level + 1, cacheMap));
    if (i < len - 1) {
      str += "".concat(htmlMarks.COMMA).concat(htmlMarks.LINEBREAK);
    } else {
      str += "".concat(options.trailingComma ? htmlMarks.COMMA : '').concat(htmlMarks.LINEBREAK);
    }
  }
  str += "".concat(htmlMarks.SPACE.repeat(indent * (level - 1))).concat(htmlMarks.ARRAYRT);
  return str;
}
function objectFormatter(input, options, level, cacheMap) {
  var keys = Reflect.ownKeys(input);
  var htmlMarks = options.htmlMarks,
    indent = options.indent;
  if (cacheMap.has(input)) {
    return htmlMarks.CIRCULAR_ERROR;
  }
  cacheMap.set(input, true);
  var str = "".concat(htmlMarks.OBJECTLT).concat(htmlMarks.LINEBREAK);
  for (var i = 0, len = keys.length; i < len; i += 1) {
    var key = typeof keys[i] === 'string' ? htmlMarks.OBJECTKEY(keys[i]) : htmlMarks.SYMBOL(keys[i]);
    str += "".concat(htmlMarks.SPACE.repeat(indent * level)).concat(key).concat(htmlMarks.SEMI).concat(mainFormatter(input[keys[i]], options, level + 1, cacheMap));
    if (i < len - 1) {
      str += "".concat(htmlMarks.COMMA).concat(htmlMarks.LINEBREAK);
    } else {
      str += "".concat(options.trailingComma ? htmlMarks.COMMA : '').concat(htmlMarks.LINEBREAK);
    }
  }
  str += "".concat(htmlMarks.SPACE.repeat(indent * (level - 1))).concat(htmlMarks.OBJECTRT);
  return str;
}
function errorFormatter(input, options) {
  var htmlMarks = options.htmlMarks;
  return input.stack ? input.stack.replace(new RegExp("(".concat(input.name, "): (").concat(input.message, ")")), function (_, $1, $2) {
    return "".concat(htmlMarks.ERROR($1)).concat(htmlMarks.SEMI).concat($2);
  }) : "".concat(htmlMarks.ERROR(input.name)).concat(htmlMarks.SEMI).concat(input.message);
}
function primaryObjectFormatter(input, options) {
  var htmlMarks = options.htmlMarks;
  var type = getType(input);
  var template = function template(t, val) {
    return "".concat(htmlMarks.ITALIC(capitalize(t)), " ").concat(htmlMarks.OBJECTLT, " ").concat(val, " ").concat(htmlMarks.OBJECTRT);
  };
  if (type === 'number') {
    return template(type, htmlMarks.NUMBER(input));
  } else if (type === 'string') {
    return template(type, htmlMarks.STRING(input));
  } else if (type === 'boolean') {
    return template(type, htmlMarks.BOOLEAN(input));
  }
  return '';
}
function functionFormatter(input, options) {
  var htmlMarks = options.htmlMarks;
  var funcStr = htmlMarks.typeMark(htmlMarks.ITALIC('ƒ '), 'function-identifier') + input.toString().replace(/^(function )(\w+)\(/g, function ($0, $1, $2) {
    return "".concat($1).concat(htmlMarks.typeMark($2, 'function-name'), "(");
  }).replace(/^function /, '').replace(/(^function|=>)/, function ($0) {
    return htmlMarks.typeMark($0, 'function-identifier');
  });
  return options.htmlMarks.FUNCTION(funcStr);
}
function primaryFormatter(input, options) {
  var htmlMarks = options.htmlMarks;
  if (isString(input)) {
    return htmlMarks.STRING(input);
  } else if (isNumber(input)) {
    return htmlMarks.NUMBER(input);
  } else if (isBoolean(input)) {
    return htmlMarks.BOOLEAN(input);
  } else if (isBigInt(input)) {
    return htmlMarks.BIGINT(input);
  } else if (isSymbol(input)) {
    return htmlMarks.SYMBOL(input);
  } else if (isNull(input)) {
    return htmlMarks.NULL;
  }
  return htmlMarks.UNDEFINED;
}
/******/ 	return __webpack_exports__;
/******/ })()
;
});