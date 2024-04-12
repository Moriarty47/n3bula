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
export declare class NCache {
    private cache;
    private maxCacheSize;
    private maxAge;
    private _hitCount;
    private _missCount;
    private debug;
    constructor({ maxCacheSize, maxAge, debug, }?: NCacheOptions);
    put(key: string, value: any, time?: number): Promise<CacheItem>;
    get(key: string): Promise<CacheItem | undefined>;
    delete(key: string): Promise<boolean>;
    keys(): Promise<string[]>;
    clear(): void;
    get size(): number;
    get hitCount(): number;
    get missCount(): number;
    get isEmpty(): boolean;
    set debugMode(value: boolean);
    status(stringify?: boolean): string | {
        cacheSize: number;
        hitCount: number;
        missCount: number;
    };
}
export {};
