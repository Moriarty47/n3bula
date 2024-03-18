export type UnionWithException<T extends (string | number)[]> = (Readonly<T>)[number] | (string & {});
export type ThingType = UnionWithException<[
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
export type PrimaryType = number | string | boolean | symbol | bigint | null | undefined;
export declare const getType: (thing: unknown) => string;
export declare const isType: (thing: unknown, type: ThingType) => boolean;
export declare const isNumber: (thing: unknown) => thing is number;
export declare const isString: (thing: unknown) => thing is string;
export declare const isBoolean: (thing: unknown) => thing is boolean;
export declare const isBigInt: (thing: unknown) => thing is bigint;
export declare const isSymbol: (thing: unknown) => thing is symbol;
export declare const isNull: (thing: unknown) => thing is null;
export declare const isUndefined: (thing: unknown) => thing is undefined;
export declare const isNullable: (thing: unknown) => thing is null | undefined;
export declare const isPrimary: (thing: unknown) => thing is PrimaryType;
export declare const isArray: (thing: unknown) => thing is any[];
export declare const isFunction: (thing: unknown) => thing is () => void;
export declare const isObject: (thing: unknown) => thing is {};
