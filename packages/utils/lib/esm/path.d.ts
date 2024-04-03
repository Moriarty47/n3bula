/**
 * Win32 methods have been removed to make this only useful for the browser.
 * Node path from [v16.20.2](https://github.com/nodejs/node/blob/v16.20.2)
 */
type PathObject = Partial<{
    dir: string;
    ext: string;
    root: string;
    base: string;
    name: string;
}>;
export declare function resolve(...rest: string[]): string;
export declare function normalize(path: string): string;
export declare function isAbsolute(path: string): boolean;
export declare function join(...rest: string[]): string;
export declare function relative(from: string, to: string): string;
export declare function toNamespacedPath(path: string): string;
export declare function dirname(path: string): string;
export declare function basename(path: string, suffix?: string): string;
export declare function extname(path: string): string;
export declare function format(pathObject?: PathObject): string;
export declare function parse(path: string): PathObject;
export declare const sep = "/";
export declare const delimiter = ":";
export declare const posix: null;
declare const path: {
    sep: string;
    delimiter: string;
    posix: null;
    join: typeof join;
    parse: typeof parse;
    format: typeof format;
    resolve: typeof resolve;
    dirname: typeof dirname;
    extname: typeof extname;
    basename: typeof basename;
    relative: typeof relative;
    normalize: typeof normalize;
    isAbsolute: typeof isAbsolute;
    toNamespacedPath: typeof toNamespacedPath;
    _makeLong: typeof toNamespacedPath;
};
export default path;
