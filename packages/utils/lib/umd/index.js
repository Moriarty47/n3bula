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

/***/ 187:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var _1 = __webpack_require__(88);
var root_1 = __importDefault(__webpack_require__(466));
/** @public */
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
  if ((0, _1.isObject)(options)) {
    leading = !!options.leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
    maxing = 'maxWait' in options;
    maxDelay = maxing ? Math.max(options.maxDelay || 0, delay) : maxDelay;
  }
  var useRAF = !delay && delay !== 0 && typeof root_1["default"].requestAnimationFrame === 'function';
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
      root_1["default"].cancelAnimationFrame(timerId);
      return root_1["default"].requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, delay);
  }
  function cancelTimer(id) {
    if (useRAF) {
      return root_1["default"].cancelAnimationFrame(id);
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
    var time = Date.now();
    var isInvoking = shouldInvoke(time);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
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
exports["default"] = debounce;

/***/ }),

/***/ 88:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);



var __importDefault = undefined && undefined.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(__webpack_exports__, "__esModule", ({
  value: true
}));
exports.simpleMerge = exports.emptyPadStart = exports.padStartEnd = exports.padEnd = exports.padStart = exports.getCharLength = exports.isAllSameChar = exports.getCodePointLength = exports.is32Bit = exports.kebab2camel = exports.camel2kebab = exports.decapitalize = exports.capitalize = exports.isObject = exports.isFunction = exports.isArray = exports.isPrimary = exports.isNullable = exports.isUndefined = exports.isNull = exports.isSymbol = exports.isBigInt = exports.isBoolean = exports.isString = exports.isNumber = exports.isType = exports.getType = exports.throttle = exports.debounce = void 0;
var debounce_1 = __importDefault(__webpack_require__(187));
var throttle_1 = __importDefault(__webpack_require__(159));
/** @public */
exports.debounce = debounce_1["default"];
/** @public */
exports.throttle = throttle_1["default"];
/** @public */
var getType = function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();
};
exports.getType = getType;
/** @public */
var isType = function isType(thing, type) {
  return (0, exports.getType)(thing) === type.toLowerCase();
};
exports.isType = isType;
/** @public */
var isNumber = function isNumber(thing) {
  return (0, exports.isType)(thing, 'number');
};
exports.isNumber = isNumber;
/** @public */
var isString = function isString(thing) {
  return (0, exports.isType)(thing, 'string');
};
exports.isString = isString;
/** @public */
var isBoolean = function isBoolean(thing) {
  return (0, exports.isType)(thing, 'boolean');
};
exports.isBoolean = isBoolean;
/** @public */
var isBigInt = function isBigInt(thing) {
  return (0, exports.isType)(thing, 'bigint');
};
exports.isBigInt = isBigInt;
/** @public */
var isSymbol = function isSymbol(thing) {
  return (0, exports.isType)(thing, 'symbol');
};
exports.isSymbol = isSymbol;
/** @public */
var isNull = function isNull(thing) {
  return (0, exports.isType)(thing, 'null');
};
exports.isNull = isNull;
/** @public */
var isUndefined = function isUndefined(thing) {
  return (0, exports.isType)(thing, 'undefined');
};
exports.isUndefined = isUndefined;
/** @public */
var isNullable = function isNullable(thing) {
  return (0, exports.isNull)(thing) || (0, exports.isUndefined)(thing);
};
exports.isNullable = isNullable;
/** @public */
var isPrimary = function isPrimary(thing) {
  if (thing !== null && (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(thing) === 'object' || typeof thing === 'function')) return false;
  return true;
};
exports.isPrimary = isPrimary;
/** @public */
var isArray = function isArray(thing) {
  return (0, exports.isType)(thing, 'array');
};
exports.isArray = isArray;
/** @public */
var isFunction = function isFunction(thing) {
  return (0, exports.isType)(thing, 'function');
};
exports.isFunction = isFunction;
/** @public */
var isObject = function isObject(thing) {
  return (0, exports.isType)(thing, 'object');
};
exports.isObject = isObject;
/** @public */
var capitalize = function capitalize() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (!str) return '';
  var firstLetter = str.slice(0, 1) || '';
  var rest = str.slice(1);
  return String(firstLetter).toUpperCase() + rest;
};
exports.capitalize = capitalize;
/** @public */
var decapitalize = function decapitalize() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (!str) return '';
  var firstLetter = str.slice(0, 1) || '';
  var rest = str.slice(1);
  return String(firstLetter).toLowerCase() + rest;
};
exports.decapitalize = decapitalize;
/** @public */
var camel2kebab = function camel2kebab() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (!str) return '';
  return (str || '').replace(/([A-Z])(\w)/g, function (_, p1, p2) {
    return "-".concat(p1.toLowerCase()).concat(p2);
  }).replace(/_/gm, '-');
};
exports.camel2kebab = camel2kebab;
/** @public */
var kebab2camel = function kebab2camel() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  if (!str) return '';
  return (str || '').replace(/[-_](\w)/g, function (_, p1) {
    return p1.toUpperCase();
  });
};
exports.kebab2camel = kebab2camel;
/** @public */
var is32Bit = function is32Bit(_char, i) {
  return _char.codePointAt(i) > 0xffff;
};
exports.is32Bit = is32Bit;
/** @public */
var getCodePointLength = function getCodePointLength(str) {
  var len = 0;
  for (var i = 0, strLen = str.length; i < strLen; i += 1) {
    if ((0, exports.is32Bit)(str, i)) i++;
    len++;
  }
  return len;
};
exports.getCodePointLength = getCodePointLength;
/** @public */
var isAllSameChar = function isAllSameChar(str, _char2) {
  return new RegExp("^(".concat(_char2, ")\\1*$")).test(str);
};
exports.isAllSameChar = isAllSameChar;
/** @public */
var getCharLength = function getCharLength(str) {
  return str.replace(/[^\x00-\xff]/g, '  ').length;
};
exports.getCharLength = getCharLength;
/** @public */
var padStart = function padStart(str, length, _char3) {
  var strLen = (0, exports.getCodePointLength)(str);
  var padding = _char3.repeat(Math.max(0, length - strLen));
  return padding + str;
};
exports.padStart = padStart;
/** @public */
var padEnd = function padEnd(str, length, _char4) {
  var strLen = (0, exports.getCodePointLength)(str);
  var padding = _char4.repeat(Math.max(0, length - strLen));
  return str + padding;
};
exports.padEnd = padEnd;
/** @public */
var padStartEnd = function padStartEnd(str, length) {
  var char1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var char2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : char1;
  var strLen = (0, exports.getCodePointLength)(str);
  var paddingLen = Math.max(0, length - strLen);
  var leftPadingLen = Math.floor(paddingLen / 2);
  var rightPadingLen = paddingLen - leftPadingLen;
  return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};
exports.padStartEnd = padStartEnd;
/** @public */
var emptyPadStart = function emptyPadStart(length) {
  var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return (0, exports.padStart)(str, length, pad);
};
exports.emptyPadStart = emptyPadStart;
/** @public */
var simpleMerge = function simpleMerge(source) {
  var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var merged = Object.assign({}, source);
  Object.keys(source).forEach(function (key) {
    if ((0, exports.isObject)(source[key])) {
      merged[key] = (0, exports.simpleMerge)(source[key], object[key]);
      return;
    }
    merged[key] = object[key] || source[key];
  });
  return merged;
};
exports.simpleMerge = simpleMerge;
exports["default"] = {
  getType: exports.getType,
  isType: exports.isType,
  isNumber: exports.isNumber,
  isString: exports.isString,
  isBoolean: exports.isBoolean,
  isBigInt: exports.isBigInt,
  isSymbol: exports.isSymbol,
  isNull: exports.isNull,
  isUndefined: exports.isUndefined,
  isNullable: exports.isNullable,
  isPrimary: exports.isPrimary,
  isArray: exports.isArray,
  isObject: exports.isObject,
  is32Bit: exports.is32Bit,
  getCodePointLength: exports.getCodePointLength,
  isAllSameChar: exports.isAllSameChar,
  getCharLength: exports.getCharLength,
  padStart: exports.padStart,
  padEnd: exports.padEnd,
  padStartEnd: exports.padStartEnd,
  emptyPadStart: exports.emptyPadStart,
  simpleMerge: exports.simpleMerge,
  debounce: debounce_1["default"],
  throttle: throttle_1["default"]
};

/***/ }),

/***/ 466:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);



Object.defineProperty(__webpack_exports__, "__esModule", ({
  value: true
}));
var theGlobal = (typeof global === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(global)) === 'object' && global !== null && global.Object === Object && global;
var theGlobalThis = (typeof globalThis === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(globalThis)) === 'object' && globalThis !== null && globalThis.Object === Object && globalThis;
exports["default"] = theGlobalThis || theGlobal || Function('return this')();

/***/ }),

/***/ 159:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var _1 = __webpack_require__(88);
var debounce_1 = __importDefault(__webpack_require__(187));
function throttle(func, delay, options) {
  var leading = true;
  var trailing = true;
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function.');
  }
  if ((0, _1.isObject)(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return (0, debounce_1["default"])(func, delay, {
    leading: leading,
    trailing: trailing,
    maxDelay: delay
  });
}
exports["default"] = throttle;
;

/***/ }),

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(88);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map