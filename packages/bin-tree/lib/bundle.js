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

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
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
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
;// CONCATENATED MODULE: ../utils/lib/esm/index.js
/** @public */
var getType = function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();
};
/** @public */
var isType = function isType(thing, type) {
  return getType(thing) === type.toLowerCase();
};
/** @public */
var esm_isNumber = function isNumber(thing) {
  return isType(thing, 'number');
};
/** @public */
var esm_isString = function isString(thing) {
  return isType(thing, 'string');
};
/** @public */
var isSymbol = function isSymbol(thing) {
  return isType(thing, 'symbol');
};
/** @public */
var isArray = function isArray(thing) {
  return isType(thing, 'array');
};
/** @public */
var isObject = function isObject(thing) {
  return isType(thing, 'object');
};
/** @public */
var esm_isNullable = function isNullable(thing) {
  return isType(thing, 'null') || isType(thing, 'undefined');
};
/** @public */
var is32Bit = function is32Bit(char, i) {
  return char.codePointAt(i) > 0xffff;
};
/** @public */
var getCodePointLength = function getCodePointLength(str) {
  var len = 0;
  for (var i = 0, strLen = str.length; i < strLen; i += 1) {
    if (is32Bit(str, i)) i++;
    len++;
  }
  return len;
};
/** @public */
var isAllSameChar = function isAllSameChar(str, char) {
  return new RegExp("^(".concat(char, ")\\1*$")).test(str);
};
/** @public */
var esm_getCharLength = function getCharLength(str) {
  return str.replace(/[^\x00-\xff]/g, '  ').length;
};
/** @public */
var padStart = function padStart(str, length, char) {
  var strLen = getCodePointLength(str);
  var padding = char.repeat(Math.max(0, length - strLen));
  return padding + str;
};
/** @public */
var padEnd = function padEnd(str, length, char) {
  var strLen = getCodePointLength(str);
  var padding = char.repeat(Math.max(0, length - strLen));
  return str + padding;
};
/** @public */
var padStartEnd = function padStartEnd(str, length) {
  var char1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var char2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : char1;
  var strLen = getCodePointLength(str);
  var paddingLen = Math.max(0, length - strLen);
  var leftPadingLen = Math.floor(paddingLen / 2);
  var rightPadingLen = paddingLen - leftPadingLen;
  return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};
/** @public */
var emptyPadStart = function emptyPadStart(length) {
  var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return padStart(str, length, pad);
};
/* harmony default export */ const esm = ({
  getType: getType,
  isType: isType,
  isNumber: esm_isNumber,
  isString: esm_isString,
  isArray: isArray,
  isObject: isObject,
  isNullable: esm_isNullable,
  is32Bit: is32Bit,
  getCodePointLength: getCodePointLength,
  isAllSameChar: isAllSameChar,
  getCharLength: esm_getCharLength,
  padStart: padStart,
  padEnd: padEnd,
  padStartEnd: padStartEnd,
  emptyPadStart: emptyPadStart
});
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
var simpleMerge = function simpleMerge(source) {
  var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var merged = Object.assign({}, source);
  Object.keys(source).forEach(function (key) {
    if (isObject(source[key])) {
      merged[key] = simpleMerge(source[key], object[key]);
      return;
    }
    merged[key] = object[key] || source[key];
  });
  return merged;
};
var SYMBOL_EMPTY = Symbol('Empty');
var SYMBOL_SLASH = Symbol('/');
var SYMBOL_BACKSLASH = Symbol('\\');
var SYMBOL_SPACE = Symbol('Space');
function binTreePrinter(tree) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
 * - width = (2^(n-1)-1)*3+2^(n-1) = 2^(n+1)-3
 * - height = 2^(n-1)
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
  var _preorderTraversal = preorderTraversal(tree),
    maxLength = _preorderTraversal.maxLength;
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



var BinTreeNode = /*#__PURE__*/function () {
  function BinTreeNode(value) {
    var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _classCallCheck(this, BinTreeNode);
    this.value = value;
    this.left = left;
    this.right = right;
  }
  _createClass(BinTreeNode, [{
    key: "val",
    get: function get() {
      return this.value;
    },
    set: function set(val) {
      this.value = val;
    }
  }, {
    key: "print",
    value: function print(options) {
      return binTreePrinter(this, options);
    }
  }, {
    key: "getSize",
    value: function getSize() {
      var _getSize = function _getSize(tree) {
        if (!tree) return 0;
        return 1 + _getSize(tree.left) + _getSize(tree.right);
      };
      return _getSize(this);
    }
  }, {
    key: "getLeafNodeSize",
    value: function getLeafNodeSize() {
      var _getSize = function _getSize(tree) {
        if (!tree) return 0;
        if (!tree.left && !tree.right) return 1;
        return _getSize(tree.left) + _getSize(tree.right);
      };
      return _getSize(this);
    }
  }, {
    key: "getLevelNodeSize",
    value: function getLevelNodeSize(n) {
      var _getSize = function _getSize(tree, m) {
        if (!tree || m <= 0) return 0;
        if (m === 1) return 1;
        return _getSize(tree.left, m - 1) + _getSize(tree.right, m - 1);
      };
      return _getSize(this, n);
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.getDepth();
    }
  }, {
    key: "getDepth",
    value: function getDepth() {
      var _getDepth = function _getDepth(tree) {
        if (!tree) return 0;
        var leftTD = _getDepth(tree.left);
        var rightTD = _getDepth(tree.right);
        return 1 + Math.max(leftTD, rightTD);
      };
      return _getDepth(this);
    }
  }, {
    key: "isValidBST",
    value: function isValidBST() {
      var isValid = function isValid(tree) {
        var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -Infinity;
        var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
        if (!tree) return true;
        var val = tree.value;
        return left < val && val < right && isValid(tree.left, left, val) && isValid(tree.right, val, right);
      };
      return isValid(this);
    }
  }, {
    key: "find",
    value: function find(data) {
      var _find = function _find(tree, val) {
        if (!tree || data === null) return null;
        if (tree.value === val) return tree;
        var res = _find(tree.left, val);
        if (res) return res;
        return _find(tree.right, val);
      };
      return _find(this, data);
    }
  }, {
    key: "preorderTraversal",
    value: function preorderTraversal() {
      var traversal = function traversal(node) {
        var treeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        if (!node) return treeData;
        treeData.push(node.value);
        traversal(node.left, treeData);
        traversal(node.right, treeData);
        return treeData;
      };
      return traversal(this);
    }
  }, {
    key: "inorderTraversal",
    value: function inorderTraversal() {
      var traversal = function traversal(node) {
        var treeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        if (!node) return treeData;
        traversal(node.left, treeData);
        treeData.push(node.value);
        traversal(node.right, treeData);
        return treeData;
      };
      return traversal(this);
    }
  }, {
    key: "postorderTraversal",
    value: function postorderTraversal() {
      var traversal = function traversal(node) {
        var treeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        if (!node) return treeData;
        traversal(node.left, treeData);
        traversal(node.right, treeData);
        treeData.push(node.value);
        return treeData;
      };
      return traversal(this);
    }
  }, {
    key: "levelorderTraversal",
    value: function levelorderTraversal() {
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
    }
  }]);
  return BinTreeNode;
}();
function create(treeData) {
  var genTree = function genTree() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
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
  return binTreePrinter.apply(void 0, arguments);
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