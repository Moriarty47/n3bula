/**
 * Cache for data
 */
var NCache = /** @class */ (function () {
    function NCache(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.maxCacheSize, maxCacheSize = _c === void 0 ? 10000 : _c, _d = _b.maxAge, maxAge = _d === void 0 ? 1000 * 60 * 60 * 24 * 30 : _d, _e = _b.debug, debug = _e === void 0 ? false : _e;
        this.cache = new Map();
        this.maxCacheSize = 10000;
        this.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
        this._hitCount = 0;
        this._missCount = 0;
        this.debug = false;
        this.maxCacheSize = maxCacheSize !== null && maxCacheSize !== void 0 ? maxCacheSize : this.maxCacheSize;
        this.maxAge = maxAge !== null && maxAge !== void 0 ? maxAge : this.maxAge;
        this.debug = debug !== null && debug !== void 0 ? debug : this.debug;
    }
    NCache.prototype.put = function (key, value, time) {
        if (time === void 0) { time = this.maxAge; }
        if (this.debug) {
            console.info("caching [value:".concat(value, "] at [key:").concat(key, "]"));
        }
        var oldRecord = this.cache.get(key);
        if (oldRecord) {
            if (Date.now() > oldRecord.expire) {
                this.cache.delete(key);
            }
        }
        var record = {
            value: value,
            expire: Date.now() + (Number.isNaN(Number(time)) ? this.maxAge : time),
        };
        if (this.cache.size + 1 > this.maxCacheSize) {
            var firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, record);
        return Promise.resolve(record);
    };
    NCache.prototype.get = function (key) {
        var record = this.cache.get(key);
        if (record) {
            if (Date.now() > record.expire) {
                this.cache.delete(key);
            }
            else {
                if (this.debug)
                    this._hitCount++;
                return Promise.resolve(record);
            }
        }
        if (this.debug)
            this._missCount++;
        return Promise.resolve(undefined);
    };
    NCache.prototype.delete = function (key) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    };
    NCache.prototype.keys = function () {
        return Promise.resolve((Array.from(this.cache.keys())));
    };
    NCache.prototype.clear = function () {
        this.cache.clear();
        this._hitCount = 0;
        this._missCount = 0;
        if (this.debug)
            console.info('cache cleared');
    };
    Object.defineProperty(NCache.prototype, "size", {
        get: function () {
            return this.cache.size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NCache.prototype, "hitCount", {
        get: function () {
            return this._hitCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NCache.prototype, "missCount", {
        get: function () {
            return this._missCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NCache.prototype, "isEmpty", {
        get: function () {
            return this.cache.size === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NCache.prototype, "debugMode", {
        set: function (value) {
            this.debug = value;
        },
        enumerable: false,
        configurable: true
    });
    NCache.prototype.status = function (stringify) {
        if (stringify === void 0) { stringify = true; }
        return stringify
            ? "cache size: ".concat(this.cache.size, ", hit count: ").concat(this._hitCount, ", miss count: ").concat(this._missCount)
            : {
                cacheSize: this.cache.size,
                hitCount: this._hitCount,
                missCount: this._missCount,
            };
    };
    return NCache;
}());
export { NCache };
