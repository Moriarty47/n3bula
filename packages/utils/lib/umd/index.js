(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["N3bulaUtils"] = factory();
	else
		root["N3bulaUtils"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 316:
/***/ ((module) => {

function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  camel2kebab: () => (/* reexport */ camel2kebab),
  capitalize: () => (/* reexport */ capitalize),
  debounce: () => (/* reexport */ debounce),
  decapitalize: () => (/* reexport */ decapitalize),
  emptyPadStart: () => (/* reexport */ emptyPadStart),
  getCharLength: () => (/* reexport */ getCharLength),
  getCodePointLength: () => (/* reexport */ getCodePointLength),
  getType: () => (/* reexport */ getType),
  is32Bit: () => (/* reexport */ is32Bit),
  isAllSameChar: () => (/* reexport */ isAllSameChar),
  isArray: () => (/* reexport */ isArray),
  isBigInt: () => (/* reexport */ isBigInt),
  isBoolean: () => (/* reexport */ isBoolean),
  isFunction: () => (/* reexport */ isFunction),
  isInt32: () => (/* reexport */ isInt32),
  isNull: () => (/* reexport */ isNull),
  isNullable: () => (/* reexport */ isNullable),
  isNumber: () => (/* reexport */ isNumber),
  isObject: () => (/* reexport */ isObject),
  isPrimary: () => (/* reexport */ isPrimary),
  isString: () => (/* reexport */ isString),
  isSymbol: () => (/* reexport */ isSymbol),
  isType: () => (/* reexport */ isType),
  isUint32: () => (/* reexport */ isUint32),
  isUndefined: () => (/* reexport */ isUndefined),
  kebab2camel: () => (/* reexport */ kebab2camel),
  padEnd: () => (/* reexport */ padEnd),
  padStart: () => (/* reexport */ padStart),
  padStartEnd: () => (/* reexport */ padStartEnd),
  path: () => (/* reexport */ src_path),
  root: () => (/* reexport */ root),
  simpleMerge: () => (/* reexport */ simpleMerge),
  throttle: () => (/* reexport */ throttle),
  validateInt32: () => (/* reexport */ validateInt32),
  validateUint32: () => (/* reexport */ validateUint32)
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(316);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);
;// CONCATENATED MODULE: ./src/root.ts

var theGlobal = (typeof global === "undefined" ? "undefined" : typeof_default()(global)) === 'object' && global !== null && global.Object === Object && global;
var theGlobalThis = (typeof globalThis === "undefined" ? "undefined" : typeof_default()(globalThis)) === 'object' && globalThis !== null && globalThis.Object === Object && globalThis;
/* harmony default export */ const root = (theGlobalThis || theGlobal || Function('return this')());
;// CONCATENATED MODULE: ./src/path.ts

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
    cwd: function cwd() {
      return '/';
    }
  };
}
var charCodeAt = function charCodeAt(str, index) {
  return String.prototype.charCodeAt.call(str, index);
};
var lastIndexOf = function lastIndexOf(str, searchString) {
  return String.prototype.lastIndexOf.call(str, searchString);
};
var slice = function slice(str, start, end) {
  return String.prototype.slice.call(str, start, end);
};
var isCharDot = function isCharDot(code) {
  return code === CHAR_DOT;
};
var isPosixPathSeparator = function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
};
function assertPath(path) {
  var pathType = typeof_default()(path);
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
    } else if (isPosixPathSeparator(code)) {
      break;
    } else {
      code = CHAR_FORWARD_SLASH;
    }
    if (isPosixPathSeparator(code)) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || !isCharDot(charCodeAt(res, res.length - 1)) || !isCharDot(charCodeAt(res, res.length - 2))) {
          if (res.length > 2) {
            var lastSlashIndex = lastIndexOf(res, '/');
            if (lastSlashIndex === -1) {
              res = '';
              lastSegmentLength = 0;
            } else {
              res = slice(res, 0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - lastIndexOf(res, '/');
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length !== 0) {
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
      } else {
        if (res.length > 0) {
          res += "/".concat(slice(path, lastSlash + 1, i));
        } else {
          res = slice(path, lastSlash + 1, i);
        }
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (isCharDot(code) && dots !== -1) {
      dots++;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep, pathObject) {
  if (pathObject === void 0) {
    pathObject = {};
  }
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || "".concat(pathObject.name || '').concat(pathObject.ext || '');
  if (!dir) return base;
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
    if (path_1.length === 0) continue;
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
  if (path.length === 0) return '.';
  var isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
  var trailingSeparator = isPosixPathSeparator(charCodeAt(path, path.length - 1));
  path = normalizeStringPosix(path, !isAbsolute);
  if (path.length === 0) {
    if (isAbsolute) return '/';
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
  if (rest.length === 0) return '.';
  var joined;
  for (var i = 0; i < rest.length; i++) {
    var arg = rest[i];
    assertPath(arg);
    if (arg.length > 0) {
      joined = joined === undefined ? arg : joined += "/".concat(arg);
    }
  }
  if (joined === undefined) return '.';
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return '';
  // Trim leading forward slashes.
  from = resolve(from);
  to = resolve(to);
  if (from === to) return '';
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
    } else if (isPosixPathSeparator(fromCode)) {
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
    } else if (fromLen > length) {
      if (isPosixPathSeparator(charCodeAt(from, fromStart + i))) {
        // We get here if `to` is the exact base path for `from`.
        // For example: from='/foo/bar/baz'; to='/foo/bar'
        lastCommonSep = i;
      } else if (i === 0) {
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
    if (i === fromEnd || isPosixPathSeparator(charCodeAt(from, i))) {
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
  if (path.length === 0) return '.';
  var hasRoot = isPosixPathSeparator(charCodeAt(path, 0));
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; i--) {
    if (isPosixPathSeparator(charCodeAt(path, i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) return '//';
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
    if (suffix === path) return '';
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
      } else {
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
          } else {
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
    } else if (end === -1) {
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
    } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }
  if (end === -1) return '';
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
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 ||
  // We saw a non-dot character immediately before the dot
  preDotState === 0 ||
  // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return slice(path, startDot, end);
}
;
function format(pathObject) {
  if (pathObject === null || typeof_default()(pathObject) !== 'object') {
    throw new TypeError("Paramter \"pathObject\" must be an object, not ".concat(typeof_default()(pathObject)));
  }
  return _format('/', pathObject);
}
;
function parse(path) {
  assertPath(path);
  var ret = {
    ext: '',
    dir: '',
    root: '',
    base: '',
    name: ''
  };
  if (path.length === 0) return ret;
  var isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
  var start;
  if (isAbsolute) {
    ret.root = '/';
    start = 1;
  } else {
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
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot !== -1) {
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
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      ret.base = ret.name = slice(path, start_1, end);
    } else {
      ret.name = slice(path, start_1, startDot);
      ret.base = slice(path, start_1, end);
      ret.ext = slice(path, startDot, end);
    }
  }
  if (startPart > 0) {
    ret.dir = slice(path, 0, startPart - 1);
  } else if (isAbsolute) {
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
  _makeLong: toNamespacedPath
};
/* harmony default export */ const src_path = (path);
;// CONCATENATED MODULE: ./src/is.ts

var getType = function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();
};
var isType = function isType(thing, type) {
  return getType(thing) === type.toLowerCase();
};
var isNumber = function isNumber(thing) {
  return isType(thing, 'number');
};
var isString = function isString(thing) {
  return isType(thing, 'string');
};
var isBoolean = function isBoolean(thing) {
  return isType(thing, 'boolean');
};
var isBigInt = function isBigInt(thing) {
  return isType(thing, 'bigint');
};
var isSymbol = function isSymbol(thing) {
  return isType(thing, 'symbol');
};
var isNull = function isNull(thing) {
  return isType(thing, 'null');
};
var isUndefined = function isUndefined(thing) {
  return isType(thing, 'undefined');
};
var isNullable = function isNullable(thing) {
  return isNull(thing) || isUndefined(thing);
};
var isPrimary = function isPrimary(thing) {
  if (thing !== null && (typeof_default()(thing) === 'object' || typeof thing === 'function')) return false;
  return true;
};
var isArray = function isArray(thing) {
  return isType(thing, 'array');
};
var isFunction = function isFunction(thing) {
  return isType(thing, 'function');
};
var isObject = function isObject(thing) {
  return isType(thing, 'object');
};
;// CONCATENATED MODULE: ./src/debounce.ts


function debounce(func, delay, options) {
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
  var useRAF = !delay && delay !== 0 && typeof root.requestAnimationFrame === 'function';
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
    return maxing ? Math.min(timeDelaying, maxDelay - timeSinceLastInvoke) : timeDelaying;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime;
    var timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === undefined || timeSinceLastCall >= delay || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxDelay;
  }
  function timerExpired() {
    var time = Date.now();
    if (shouldInvoke(time)) return trailingEdge(time);
    timerId = startTimer(timerExpired, remainingDelay(time));
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = startTimer(timerExpired, delay);
    return leading ? invokeFunc(time) : result;
  }
  function trailingEdge(time) {
    timerId = undefined;
    if (trailing && lastArgs) return invokeFunc(time);
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
;// CONCATENATED MODULE: ./src/throttle.ts


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
;// CONCATENATED MODULE: ./src/string.ts
var capitalize = function capitalize(str) {
  if (str === void 0) {
    str = '';
  }
  if (!str) return '';
  var firstLetter = str.slice(0, 1) || '';
  var rest = str.slice(1);
  return String(firstLetter).toUpperCase() + rest;
};
var decapitalize = function decapitalize(str) {
  if (str === void 0) {
    str = '';
  }
  if (!str) return '';
  var firstLetter = str.slice(0, 1) || '';
  var rest = str.slice(1);
  return String(firstLetter).toLowerCase() + rest;
};
var camel2kebab = function camel2kebab(str) {
  if (str === void 0) {
    str = '';
  }
  if (!str) return '';
  return (str || '').replace(/([A-Z])(\w)/g, function (_, p1, p2) {
    return "-".concat(p1.toLowerCase()).concat(p2);
  }).replace(/_/gm, '-');
};
var kebab2camel = function kebab2camel(str) {
  if (str === void 0) {
    str = '';
  }
  if (!str) return '';
  return (str || '').replace(/[-_](\w)/g, function (_, p1) {
    return p1.toUpperCase();
  });
};
var is32Bit = function is32Bit(_char, i) {
  return _char.codePointAt(i) > 0xffff;
};
var getCodePointLength = function getCodePointLength(str) {
  var len = 0;
  for (var i = 0, strLen = str.length; i < strLen; i += 1) {
    if (is32Bit(str, i)) i++;
    len++;
  }
  return len;
};
var isAllSameChar = function isAllSameChar(str, _char2) {
  return new RegExp("^(".concat(_char2, ")\\1*$")).test(str);
};
var getCharLength = function getCharLength(str) {
  return str.replace(/[^\x00-\xff]/g, '  ').length;
};
var padStart = function padStart(str, length, _char3) {
  var strLen = getCodePointLength(str);
  var padding = _char3.repeat(Math.max(0, length - strLen));
  return padding + str;
};
var padEnd = function padEnd(str, length, _char4) {
  var strLen = getCodePointLength(str);
  var padding = _char4.repeat(Math.max(0, length - strLen));
  return str + padding;
};
var padStartEnd = function padStartEnd(str, length, char1, char2) {
  if (char1 === void 0) {
    char1 = '';
  }
  if (char2 === void 0) {
    char2 = char1;
  }
  var strLen = getCodePointLength(str);
  var paddingLen = Math.max(0, length - strLen);
  var leftPadingLen = Math.floor(paddingLen / 2);
  var rightPadingLen = paddingLen - leftPadingLen;
  return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};
var emptyPadStart = function emptyPadStart(length, str, pad) {
  if (str === void 0) {
    str = '';
  }
  if (pad === void 0) {
    pad = '';
  }
  return padStart(str, length, pad);
};
;// CONCATENATED MODULE: ./src/number.ts
var isInt32 = function isInt32(value) {
  return value === (value | 0);
};
var isUint32 = function isUint32(value) {
  return value === value >>> 0;
};
var validateInt32 = function validateInt32(value) {
  return !(value < -2147483648 || value > 2147483647);
};
var validateUint32 = function validateUint32(value) {
  return !(value < 0 || value > 4294967295);
};
;// CONCATENATED MODULE: ./src/merge.ts
var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};

var simpleMerge = function simpleMerge(source, object) {
  if (object === void 0) {
    object = {};
  }
  var merged = __assign({}, source);
  Object.keys(source).forEach(function (key) {
    if (isObject(source[key])) {
      merged[key] = simpleMerge(source[key], object[key]);
      return;
    }
    merged[key] = object[key] || source[key];
  });
  return merged;
};
;// CONCATENATED MODULE: ./src/index.ts








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});