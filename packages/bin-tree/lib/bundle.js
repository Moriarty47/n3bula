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
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@babel+runtime@7.22.11/node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
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
var isNumber = function isNumber(thing) {
  return isType(thing, 'number');
};
/** @public */
var isString = function isString(thing) {
  return isType(thing, 'string');
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
var isNullable = function isNullable(thing) {
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
var getCharLength = function getCharLength(str) {
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
  isNumber: isNumber,
  isString: isString,
  isArray: isArray,
  isObject: isObject,
  isNullable: isNullable,
  is32Bit: is32Bit,
  getCodePointLength: getCodePointLength,
  isAllSameChar: isAllSameChar,
  getCharLength: getCharLength,
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
  var newObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.keys(source).forEach(function (key) {
    if (isObject(source[key])) {
      newObj[key] = simpleMerge(source[key], object[key], {});
      return;
    }
    newObj[key] = object[key] || source[key];
  });
  return newObj;
};
function binTreePrinter(tree) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = simpleMerge(defaults, options);
  var _levelOrderTraversal = levelOrderTraversal(tree),
    _levelOrderTraversal2 = _slicedToArray(_levelOrderTraversal, 4),
    nodesArr = _levelOrderTraversal2[0],
    treeDepth = _levelOrderTraversal2[1],
    nodesNum = _levelOrderTraversal2[2],
    maxNumber = _levelOrderTraversal2[3];
  if (nodesArr.length === 1 && nodesArr[0][0] === EMPTY_CHAR) return null;
  createMarksArr(nodesArr, config, treeDepth, nodesNum, maxNumber);
  return generateTreeStr(nodesArr, config);
}
function generateTreeStr(nodesArr, config) {
  var marks = config.marks;
  var treeStr = '';
  nodesArr.forEach(function (nodes, idx) {
    var branchStr = '';
    if (idx === 0) {
      branchStr += nodes.join('') + '\n';
    } else {
      var temp = '';
      var useBranch = false;
      nodes.forEach(function (node) {
        var strLength = getCodePointLength(node);
        var isSameEmptyChar = isAllSameChar(node, EMPTY_CHAR);
        var isSameHashChar = isAllSameChar(node, HASH_CHAR);
        if (!useBranch && isSameEmptyChar) {
          branchStr += emptyPadStart(strLength, '', EMPTY_CHAR);
        } else if (!useBranch && isSameHashChar) {
          useBranch = true;
          branchStr += padStartEnd(marks.lb, strLength, EMPTY_CHAR, marks.dash);
        } else if (!useBranch && !isSameEmptyChar) {
          useBranch = true;
          branchStr += padStartEnd(marks.lt, strLength, EMPTY_CHAR, marks.dash);
        } else if (useBranch && isSameEmptyChar) {
          branchStr += padEnd(marks.dash, strLength, marks.dash);
        } else if (useBranch && isSameHashChar) {
          branchStr += strLength > 1 ? padStartEnd(marks.joint, strLength, marks.dash) : marks.joint;
        } else if (useBranch && !isSameEmptyChar && !isSameHashChar) {
          useBranch = false;
          branchStr += padStartEnd(marks.rt, strLength, marks.dash, EMPTY_CHAR);
        }
        // current level data
        temp += isSameHashChar ? emptyPadStart(strLength, '', EMPTY_CHAR) : node;
      });
      if (branchStr.endsWith(marks.dash)) {
        //  deal with the right subtree is null
        var turnStrIndex = branchStr.lastIndexOf(marks.joint);
        var turnStr = branchStr.slice(0, turnStrIndex);
        branchStr = turnStr + marks.rb;
      }
      branchStr += '\n' + temp + '\n';
    }
    treeStr += branchStr;
  });
  return treeStr;
}
function createMarksArr(nodesArr, config, treeDepth, nodesNum, maxNumber) {
  var maxNumLen = Math.max(config.minLength, getCharLength(String(maxNumber)));
  var maxNumberLength = maxNumLen % 2 === 0 ? maxNumLen + 1 : maxNumLen;
  var emptySpace = emptyPadStart(maxNumberLength, '', EMPTY_CHAR);
  var nodesLength = nodesNum;
  var uniqueHashes = [];
  nodesArr.forEach(function (nodes, level) {
    var lvGap = Math.pow(2, treeDepth - level);
    var lvNodes = Array(nodesNum).fill(emptySpace);
    var nodeIdx = nodesLength = (nodesLength - 1) / 2;
    nodes.forEach(function (node, idx) {
      if (idx !== 0) {
        var midIdx = nodeIdx + lvGap / 2;
        if (node.includes(NULL_CHAR)) {
          if (idx - 1 >= 0 && nodes[idx - 1].includes(NULL_CHAR)) {
            uniqueHashes[midIdx] = true;
          }
        }
        if (!uniqueHashes[midIdx]) {
          uniqueHashes[midIdx] = true;
          lvNodes[midIdx] = emptyPadStart(maxNumberLength, HASH_CHAR, HASH_CHAR);
        }
        nodeIdx += lvGap;
      }
      lvNodes[nodeIdx] = padStartEnd(node.includes(NULL_CHAR) ? EMPTY_CHAR : node, maxNumberLength, EMPTY_CHAR);
    });
    nodesArr[level] = lvNodes;
  });
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