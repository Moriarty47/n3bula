type NCacheOptions = {
  maxCacheSize?: number;
  maxAge?: number;
  debug?: boolean;
};

type CacheItem = {
  value: any;
  expire: number;
};

/**
 * Cache for data
 */
export class NCache {
  private cache: Map<string, CacheItem> = new Map();
  private maxCacheSize: number = 10000;
  private maxAge: number = 1000 * 60 * 60 * 24 * 30; // 30 days
  private _hitCount: number = 0;
  private _missCount: number = 0;
  private debug: boolean = false;

  constructor({
    maxCacheSize = 10000,
    maxAge = 1000 * 60 * 60 * 24 * 30,
    debug = false,
  }: NCacheOptions = {}) {
    this.maxCacheSize = maxCacheSize ?? this.maxCacheSize;
    this.maxAge = maxAge ?? this.maxAge;
    this.debug = debug ?? this.debug;
  }

  put(key: string, value: any, time: number = this.maxAge): Promise<CacheItem> {
    if (this.debug) {
      console.info(`caching [value:${value}] at [key:${key}]`);
    }

    const oldRecord = this.cache.get(key);
    if (oldRecord) {
      if (Date.now() > oldRecord.expire) {
        this.cache.delete(key);
      }
    }

    const record = {
      value,
      expire: Date.now() + (Number.isNaN(Number(time)) ? this.maxAge : time),
    };

    if (this.cache.size + 1 > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, record);

    return Promise.resolve(record);
  }

  get(key: string): Promise<CacheItem | undefined> {
    const record = this.cache.get(key);
    if (record) {
      if (Date.now() > record.expire) {
        this.cache.delete(key);
      } else {
        if (this.debug) this._hitCount++;
        return Promise.resolve(record);
      }
    }

    if (this.debug) this._missCount++;
    return Promise.resolve(undefined);
  }

  delete(key: string): Promise<boolean> {
    if (this.cache.has(key)) {
      this.cache.delete(key);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  keys(): Promise<string[]> {
    return Promise.resolve((Array.from(this.cache.keys())));
  }

  clear(): void {
    this.cache.clear();
    this._hitCount = 0;
    this._missCount = 0;
    if (this.debug) console.info('cache cleared');
  }

  get size(): number {
    return this.cache.size;
  }

  get hitCount(): number {
    return this._hitCount;
  }

  get missCount(): number {
    return this._missCount;
  }

  get isEmpty(): boolean {
    return this.cache.size === 0;
  }

  set debugMode(value: boolean) {
    this.debug = value;
  }

  status(stringify: boolean = true) {
    return stringify
      ? `cache size: ${this.cache.size}, hit count: ${this._hitCount}, miss count: ${this._missCount}`
      : {
        cacheSize: this.cache.size,
        hitCount: this._hitCount,
        missCount: this._missCount,
      };
  }
}

