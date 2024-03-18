/******/ (() => { // webpackBootstrap
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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* binding */ EventEmitter),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useEventEmitter: () => (/* binding */ useEventEmitter)
/* harmony export */ });
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
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var create = Object.create;
var apply = Function.prototype.apply;
var defProp = Object.defineProperty;
var descriptor = {
    configurable: false,
    enumerable: false,
    writable: true,
};
var ONCE = Symbol('__ONCE__');
var __ee_id = 0;
var EventEmitter = /** @class */ (function () {
    function EventEmitter(name) {
        defProp(this, '__ee_id', __assign({ value: name || __ee_id++, writable: false }, descriptor));
        this.events = create(null);
    }
    EventEmitter.prototype.on = function (type, listener, once) {
        if (once === void 0) { once = false; }
        this.events[type] = this.events[type] || [];
        if (this.events[type].indexOf(listener) === -1) {
            if (once) {
                defProp(listener, ONCE, __assign(__assign({}, descriptor), { value: true }));
            }
            this.events[type].push(listener);
        }
        return this;
    };
    EventEmitter.prototype.once = function (type, listener) {
        this.on(type, listener, true);
        return this;
    };
    EventEmitter.prototype.off = function (type, listener) {
        var listeners = this.events[type];
        if (!listeners)
            return this;
        var index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
        return this;
    };
    EventEmitter.prototype.emit = function (type) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var listeners = this.events[type];
        if (!listeners)
            return this;
        var array = listeners.slice(0);
        for (var i = 0; i < array.length; i += 1) {
            apply.call(array[i], this, rest);
            if (array[i][ONCE]) {
                this.off(type, listeners[i]);
            }
        }
    };
    EventEmitter.prototype.hasListeners = function (type) {
        var _a;
        if (type) {
            return !!((_a = this.events[type]) === null || _a === void 0 ? void 0 : _a.length);
        }
        return !!(Object.keys(this.events).length);
    };
    EventEmitter.prototype.offAll = function () {
        this.events = create(null);
    };
    __decorate([
        ThrowExceptions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", void 0)
    ], EventEmitter.prototype, "on", null);
    __decorate([
        ThrowExceptions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EventEmitter.prototype, "once", null);
    __decorate([
        ThrowExceptions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EventEmitter.prototype, "off", null);
    __decorate([
        ThrowExceptions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EventEmitter.prototype, "emit", null);
    __decorate([
        ThrowExceptions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EventEmitter.prototype, "hasListeners", null);
    __decorate([
        ThrowExceptions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], EventEmitter.prototype, "offAll", null);
    return EventEmitter;
}());

;
function useEventEmitter(name) {
    return new EventEmitter(name);
}
;
function ThrowExceptions() {
    return function (_target, _propKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            try {
                return originalMethod.apply(this, rest);
            }
            catch (error) {
                throw new Error(error);
            }
        };
    };
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventEmitter);

exports.EventEmitter = __webpack_exports__.EventEmitter;
exports["default"] = __webpack_exports__["default"];
exports.useEventEmitter = __webpack_exports__.useEventEmitter;
Object.defineProperty(exports, "__esModule", { value: true });
/******/ })()
;