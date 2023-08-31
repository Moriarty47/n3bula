(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["prettyJson"] = factory();
	else
		root["prettyJson"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 88:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.prettyJSONFormatter = exports.toText = exports.toHTML = exports.render = exports.loadCSS = void 0;
var utils_1 = __webpack_require__(309);
var IS_CSS_LOADED = Symbol('is_CSS_Loaded');
var DOM_CACHE = new Map();
/** @public */
var loadCSS = function loadCSS() {
  if (window && window[IS_CSS_LOADED]) return;
  var style = document.createElement('style');
  Promise.resolve().then(function () {
    return __importStar(__webpack_require__(894));
  }).then(function (value) {
    style.textContent = value["default"];
    document.head.appendChild(style);
    Object.defineProperty(window, IS_CSS_LOADED, {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });
  });
};
exports.loadCSS = loadCSS;
var render = function render(domID, content) {
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
exports.render = render;
/** @public */
var toHTML = function toHTML(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = (0, exports.prettyJSONFormatter)(content, Object.assign(Object.assign({}, options), {
    output: 'html'
  }));
  return {
    value: result,
    render: function render(domID) {
      (0, exports.render)(domID, result);
    }
  };
};
exports.toHTML = toHTML;
/** @public */
var toText = function toText(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = (0, exports.prettyJSONFormatter)(content, Object.assign(Object.assign({}, options), {
    output: 'text'
  }));
  return {
    value: result,
    render: function render(domID) {
      (0, exports.render)(domID, result);
    }
  };
};
exports.toText = toText;
var defaults = {
  output: 'html',
  indent: 2,
  quoteKeys: false,
  singleQuote: true,
  oneLineArray: false,
  trailingComma: true
};
/** @public */
var prettyJSONFormatter = function prettyJSONFormatter(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = (0, utils_1.simpleMerge)(defaults, options);
  config.htmlMarks = presetMarks(config);
  if ((0, utils_1.isArray)(content)) {
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
exports.prettyJSONFormatter = prettyJSONFormatter;
(0, exports.loadCSS)();
exports["default"] = exports.prettyJSONFormatter;
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
  return ['string', 'number', 'boolean'].includes((0, utils_1.getType)(input));
}
function hasArrayChildren(arr) {
  return arr.some(function (ar) {
    return (0, utils_1.isArray)(ar);
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
      var arrStr = (0, utils_1.isArray)(input[i]) ? "".concat(htmlMarks.ARRAYLT, " ").concat(input[i].map(convert).join(', '), " ").concat(htmlMarks.ARRAYRT) : mainFormatter(input[i], options, 2);
      str += "".concat(htmlMarks.SPACE.repeat(indent)).concat(arrStr).concat(htmlMarks.COMMA).concat(htmlMarks.LINEBREAK);
    }
    str += "".concat(htmlMarks.ARRAYRT).concat(htmlMarks.LINEBREAK);
  } else {
    var space = ' ';
    var gap = space.repeat(2);
    var colLen = input[0].length;
    var rowIdxLength = "".concat(rowLen).length;
    var maxLength = findArrayMaxLength(input);
    str = "".concat((0, utils_1.padStart)(space, rowIdxLength, space)).concat(gap).concat(Array.from({
      length: colLen
    }, function (_, i) {
      return (0, utils_1.padEnd)('' + i, maxLength, space);
    }).join(gap)).concat(gap).concat(htmlMarks.LINEBREAK);
    for (var _i = 0; _i < rowLen; _i += 1) {
      var _arrStr = (0, utils_1.isArray)(input[_i]) ? input[_i].map(function (item) {
        return (0, utils_1.padEnd)('' + item, maxLength, space);
      }).join(gap) : mainFormatter(input[_i], options);
      str += "".concat((0, utils_1.padStart)('' + _i, rowIdxLength, space)).concat(gap).concat(_arrStr).concat(gap).concat(htmlMarks.LINEBREAK);
    }
  }
  return str;
}
function mainFormatter(input, options) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var cacheMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new WeakMap();
  var htmlMarks = options.htmlMarks;
  if ((0, utils_1.isPrimary)(input)) {
    return primaryFormatter(input, options);
  }
  if ((0, utils_1.isFunction)(input)) {
    return functionFormatter(input, options);
  }
  if (isPrimaryObject(input)) {
    return primaryObjectFormatter(input, options);
  }
  var type = (0, utils_1.getType)(input);
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
  var type = (0, utils_1.getType)(input);
  var template = function template(t, val) {
    return "".concat(htmlMarks.ITALIC((0, utils_1.capitalize)(t)), " ").concat(htmlMarks.OBJECTLT, " ").concat(val, " ").concat(htmlMarks.OBJECTRT);
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
  if ((0, utils_1.isString)(input)) {
    return htmlMarks.STRING(input);
  } else if ((0, utils_1.isNumber)(input)) {
    return htmlMarks.NUMBER(input);
  } else if ((0, utils_1.isBoolean)(input)) {
    return htmlMarks.BOOLEAN(input);
  } else if ((0, utils_1.isBigInt)(input)) {
    return htmlMarks.BIGINT(input);
  } else if ((0, utils_1.isSymbol)(input)) {
    return htmlMarks.SYMBOL(input);
  } else if ((0, utils_1.isNull)(input)) {
    return htmlMarks.NULL;
  }
  return htmlMarks.UNDEFINED;
}

/***/ }),

/***/ 309:
/***/ ((__unused_webpack_module, exports) => {



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", ({
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
  if (thing !== null && (_typeof(thing) === 'object' || typeof thing === 'function')) return false;
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

/***/ }),

/***/ 894:
/***/ ((module) => {

module.exports = ".json-container {\n  font-family: menlo, consolas, monospace;\n  font-style: normal;\n  font-weight: bold;\n  line-height: 1.4em;\n  font-size: 0.9rem;\n  transition: background-color 100ms;\n}\n\na.json-link {\n  text-decoration: none;\n  border-bottom: 1px solid;\n  outline: none;\n}\n\na.json-link:hover {\n  background-color: transparent;\n  outline: none;\n}\n\nol.json-lines {\n  white-space: normal;\n  padding-inline-start: 3em;\n  margin: 0px;\n}\n\nol.json-lines>li {\n  white-space: pre;\n  text-indent: 0.7em;\n  line-height: 1.5em;\n  padding: 0px;\n}\n\nol.json-lines>li::marker {\n  font-family: system-ui, sans-serif;\n  font-weight: normal;\n}\n\n.json-normal {\n  font-weight: normal;\n}\n\n.json-italic {\n  font-style: italic;\n}\n\n.json-key,\n.json-string,\n.json-number,\n.json-boolean,\n.json-null,\n.json-mark,\na.json-link,\nol.json-lines>li {\n  transition: all 100ms;\n}\n\n.json-container {\n  color: #ffffff;\n}\n\n.json-key {\n  color: indianred;\n}\n\n.json-error {\n  color: #ED6C89;\n}\n\n.json-string {\n  color: khaki;\n}\n\n.json-number {\n  color: deepskyblue;\n}\n\n.json-array {\n  color: limegreen;\n}\n\n.json-object {\n  color: chocolate;\n}\n\n.json-boolean {\n  color: mediumseagreen;\n}\n\n.json-symbol {\n  color: #6AD1C7;\n}\n\n.json-function {\n  font-weight: bold;\n  color: silver;\n}\n\n.json-function-identifier {\n  color: #E59A6F;\n}\n\n.json-function-name {\n  color: #90DAE6;\n}\n\n.json-bigint {\n  color: #ABABAB;\n}\n\n.json-null {\n  color: darkorange;\n}\n\n.json-undefined {\n  color: silver;\n}\n\n.json-mark {\n  color: silver;\n}\n\na.json-link {\n  color: mediumorchid;\n}\n\na.json-link:visited {\n  color: slategray;\n}\n\na.json-link:hover {\n  color: violet;\n}\n\na.json-link:active {\n  color: slategray;\n}\n\nol.json-lines>li::marker {\n  color: silver;\n}\n\nol.json-lines>li:nth-child(odd) {\n  background-color: #222222;\n}\n\nol.json-lines>li:nth-child(even) {\n  background-color: #161616;\n}\n\nol.json-lines>li:hover {\n  background-color: dimgray;\n}";

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