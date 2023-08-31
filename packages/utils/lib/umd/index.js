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
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);



Object.defineProperty(__webpack_exports__, "__esModule", ({
  value: true
}));
exports.simpleMerge = exports.emptyPadStart = exports.padStartEnd = exports.padEnd = exports.padStart = exports.getCharLength = exports.isAllSameChar = exports.getCodePointLength = exports.is32Bit = exports.kebab2camel = exports.camel2kebab = exports.decapitalize = exports.capitalize = exports.isObject = exports.isFunction = exports.isArray = exports.isPrimary = exports.isNullable = exports.isUndefined = exports.isNull = exports.isSymbol = exports.isBigInt = exports.isBoolean = exports.isString = exports.isNumber = exports.isType = exports.getType = void 0;
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
  isArray: exports.isArray,
  isObject: exports.isObject,
  isNullable: exports.isNullable,
  is32Bit: exports.is32Bit,
  getCodePointLength: exports.getCodePointLength,
  isAllSameChar: exports.isAllSameChar,
  getCharLength: exports.getCharLength,
  padStart: exports.padStart,
  padEnd: exports.padEnd,
  padStartEnd: exports.padStartEnd,
  emptyPadStart: exports.emptyPadStart,
  simpleMerge: exports.simpleMerge
};
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map