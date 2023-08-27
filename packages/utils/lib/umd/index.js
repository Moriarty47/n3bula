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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 88:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.emptyPadStart = exports.padStartEnd = exports.padEnd = exports.padStart = exports.getCharLength = exports.isAllSameChar = exports.getCodePointLength = exports.is32Bit = exports.isNullable = exports.isObject = exports.isArray = exports.isString = exports.isNumber = exports.isType = exports.getType = void 0;
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
var isArray = function isArray(thing) {
  return (0, exports.isType)(thing, 'array');
};
exports.isArray = isArray;
/** @public */
var isObject = function isObject(thing) {
  return (0, exports.isType)(thing, 'object');
};
exports.isObject = isObject;
/** @public */
var isNullable = function isNullable(thing) {
  return (0, exports.isType)(thing, 'null') || (0, exports.isType)(thing, 'undefined');
};
exports.isNullable = isNullable;
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
  emptyPadStart: exports.emptyPadStart
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[88](0, __webpack_exports__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map