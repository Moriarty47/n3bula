## API Report File for "@n3bula/utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public (undocumented)
export const camel2kebab: (str?: string) => string;

// @public (undocumented)
export const capitalize: (str?: string) => string;

// Warning: (ae-forgotten-export) The symbol "debounce_2" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export const debounce: typeof debounce_2;

// @public (undocumented)
export const decapitalize: (str?: string) => string;

// @public (undocumented)
const _default: {
    getType: (thing: unknown) => string;
    isType: (thing: unknown, type: ThingType) => boolean;
    isNumber: (thing: unknown) => thing is number;
    isString: (thing: unknown) => thing is string;
    isBoolean: (thing: unknown) => thing is boolean;
    isBigInt: (thing: unknown) => thing is bigint;
    isSymbol: (thing: unknown) => thing is symbol;
    isNull: (thing: unknown) => thing is null;
    isUndefined: (thing: unknown) => thing is undefined;
    isNullable: (thing: unknown) => thing is null | undefined;
    isPrimary: (thing: unknown) => thing is PrimaryType;
    isArray: (thing: unknown) => thing is any[];
    isObject: (thing: unknown) => thing is {};
    is32Bit: (char: string, i: number) => boolean;
    getCodePointLength: (str: string) => number;
    isAllSameChar: (str: string, char: string) => boolean;
    getCharLength: (str: string) => number;
    padStart: (str: string, length: number, char: string) => string;
    padEnd: (str: string, length: number, char: string) => string;
    padStartEnd: (str: string, length: number, char1?: string, char2?: string) => string;
    emptyPadStart: (length: number, str?: string, pad?: string) => string;
    simpleMerge: <T extends Record<string, any>>(source: T, object?: DeepPartial<T>) => T;
    debounce: typeof debounce_2;
    throttle: typeof throttle_2;
};
export default _default;

// @public (undocumented)
export const emptyPadStart: (length: number, str?: string, pad?: string) => string;

// @public (undocumented)
export const getCharLength: (str: string) => number;

// @public (undocumented)
export const getCodePointLength: (str: string) => number;

// @public (undocumented)
export const getType: (thing: unknown) => string;

// @public (undocumented)
export const is32Bit: (char: string, i: number) => boolean;

// @public (undocumented)
export const isAllSameChar: (str: string, char: string) => boolean;

// @public (undocumented)
export const isArray: (thing: unknown) => thing is any[];

// @public (undocumented)
export const isBigInt: (thing: unknown) => thing is bigint;

// @public (undocumented)
export const isBoolean: (thing: unknown) => thing is boolean;

// @public (undocumented)
export const isFunction: (thing: unknown) => thing is () => void;

// @public (undocumented)
export const isNull: (thing: unknown) => thing is null;

// @public (undocumented)
export const isNullable: (thing: unknown) => thing is null | undefined;

// @public (undocumented)
export const isNumber: (thing: unknown) => thing is number;

// @public (undocumented)
export const isObject: (thing: unknown) => thing is {};

// @public (undocumented)
export const isPrimary: (thing: unknown) => thing is PrimaryType;

// @public (undocumented)
export const isString: (thing: unknown) => thing is string;

// @public (undocumented)
export const isSymbol: (thing: unknown) => thing is symbol;

// @public (undocumented)
export const isType: (thing: unknown, type: ThingType) => boolean;

// @public (undocumented)
export const isUndefined: (thing: unknown) => thing is undefined;

// @public (undocumented)
export const kebab2camel: (str?: string) => string;

// @public (undocumented)
export const padEnd: (str: string, length: number, char: string) => string;

// @public (undocumented)
export const padStart: (str: string, length: number, char: string) => string;

// @public (undocumented)
export const padStartEnd: (str: string, length: number, char1?: string, char2?: string) => string;

// @public (undocumented)
export const simpleMerge: <T extends Record<string, any>>(source: T, object?: DeepPartial<T>) => T;

// @public (undocumented)
export const throttle: typeof throttle_2;

// @public (undocumented)
export type UnionWithException<T extends (string | number)[]> = (Readonly<T>)[number] | (string & {});

// Warnings were encountered during analysis:
//
// src/index.ts:164:3 - (ae-forgotten-export) The symbol "ThingType" needs to be exported by the entry point index.d.ts
// src/index.ts:164:3 - (ae-forgotten-export) The symbol "PrimaryType" needs to be exported by the entry point index.d.ts
// src/index.ts:164:3 - (ae-forgotten-export) The symbol "DeepPartial" needs to be exported by the entry point index.d.ts
// src/index.ts:164:3 - (ae-forgotten-export) The symbol "throttle_2" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```
