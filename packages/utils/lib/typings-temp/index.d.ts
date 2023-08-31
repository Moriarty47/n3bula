/** @public */
export type UnionWithException<T extends (string | number)[]> = (Readonly<T>)[number] | (string & {});
type ThingType = UnionWithException<[
    'string',
    'number',
    'boolean',
    'symbol',
    'bigInt',
    'null',
    'undefined',
    'array',
    'object',
    'date',
    'regexp',
    'function'
]>;
type PrimaryType = number | string | boolean | symbol | bigint | null | undefined;
/** @public */
export declare const getType: (thing: unknown) => string;
/** @public */
export declare const isType: (thing: unknown, type: ThingType) => boolean;
/** @public */
export declare const isNumber: (thing: unknown) => thing is number;
/** @public */
export declare const isString: (thing: unknown) => thing is string;
/** @public */
export declare const isBoolean: (thing: unknown) => thing is boolean;
/** @public */
export declare const isBigInt: (thing: unknown) => thing is bigint;
/** @public */
export declare const isSymbol: (thing: unknown) => thing is symbol;
/** @public */
export declare const isNull: (thing: unknown) => thing is null;
/** @public */
export declare const isUndefined: (thing: unknown) => thing is undefined;
/** @public */
export declare const isNullable: (thing: unknown) => thing is null | undefined;
/** @public */
export declare const isPrimary: (thing: unknown) => thing is PrimaryType;
/** @public */
export declare const isArray: (thing: unknown) => thing is any[];
/** @public */
export declare const isFunction: (thing: unknown) => thing is () => void;
/** @public */
export declare const isObject: (thing: unknown) => thing is {};
/** @public */
export declare const capitalize: (str?: string) => string;
/** @public */
export declare const decapitalize: (str?: string) => string;
/** @public */
export declare const camel2kebab: (str?: string) => string;
/** @public */
export declare const kebab2camel: (str?: string) => string;
/** @public */
export declare const is32Bit: (char: string, i: number) => boolean;
/** @public */
export declare const getCodePointLength: (str: string) => number;
/** @public */
export declare const isAllSameChar: (str: string, char: string) => boolean;
/** @public */
export declare const getCharLength: (str: string) => number;
/** @public */
export declare const padStart: (str: string, length: number, char: string) => string;
/** @public */
export declare const padEnd: (str: string, length: number, char: string) => string;
/** @public */
export declare const padStartEnd: (str: string, length: number, char1?: string, char2?: string) => string;
/** @public */
export declare const emptyPadStart: (length: number, str?: string, pad?: string) => string;
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends {} ? DeepPartial<T[P]> : T[P];
};
/** @public */
export declare const simpleMerge: <T extends Record<string, any>>(source: T, object?: DeepPartial<T>) => T;
declare const _default: {
    getType: (thing: unknown) => string;
    isType: (thing: unknown, type: ThingType) => boolean;
    isNumber: (thing: unknown) => thing is number;
    isString: (thing: unknown) => thing is string;
    isArray: (thing: unknown) => thing is any[];
    isObject: (thing: unknown) => thing is {};
    isNullable: (thing: unknown) => thing is null | undefined;
    is32Bit: (char: string, i: number) => boolean;
    getCodePointLength: (str: string) => number;
    isAllSameChar: (str: string, char: string) => boolean;
    getCharLength: (str: string) => number;
    padStart: (str: string, length: number, char: string) => string;
    padEnd: (str: string, length: number, char: string) => string;
    padStartEnd: (str: string, length: number, char1?: string, char2?: string) => string;
    emptyPadStart: (length: number, str?: string, pad?: string) => string;
    simpleMerge: <T extends Record<string, any>>(source: T, object?: DeepPartial<T>) => T;
};
export default _default;
//# sourceMappingURL=index.d.ts.map