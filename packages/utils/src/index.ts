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
export const getType = (thing: unknown): string =>
  Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();

/** @public */
export const isType = (thing: unknown, type: ThingType): boolean =>
  getType(thing) === type.toLowerCase();

/** @public */
export const isNumber = (thing: unknown): thing is number => isType(thing, 'number');
/** @public */
export const isString = (thing: unknown): thing is string => isType(thing, 'string');
/** @public */
export const isBoolean = (thing: unknown): thing is boolean => isType(thing, 'boolean');
/** @public */
export const isBigInt = (thing: unknown): thing is bigint => isType(thing, 'bigint');
/** @public */
export const isSymbol = (thing: unknown): thing is symbol => isType(thing, 'symbol');
/** @public */
export const isNull = (thing: unknown): thing is null => isType(thing, 'null');
/** @public */
export const isUndefined = (thing: unknown): thing is undefined => isType(thing, 'undefined');
/** @public */
export const isNullable = (thing: unknown): thing is null | undefined => isNull(thing) || isUndefined(thing);
/** @public */
export const isPrimary = (thing: unknown): thing is PrimaryType => {
  if (thing !== null && (typeof thing === 'object' || typeof thing === 'function')) return false;
  return true;
};
/** @public */
export const isArray = (thing: unknown): thing is any[] => isType(thing, 'array');
/** @public */
export const isFunction = (thing: unknown): thing is () => void => isType(thing, 'function');
/** @public */
export const isObject = (thing: unknown): thing is {} => isType(thing, 'object');
/** @public */
export const capitalize = (str: string = '') => {
  if (!str) return '';
  const firstLetter = str.slice(0, 1) || '';
  const rest = str.slice(1);
  return String(firstLetter).toUpperCase() + rest;
};
/** @public */
export const decapitalize = (str: string = '') => {
  if (!str) return '';
  const firstLetter = str.slice(0, 1) || '';
  const rest = str.slice(1);
  return String(firstLetter).toLowerCase() + rest;
};
/** @public */
export const camel2kebab = (str: string = '') => {
  if (!str) return '';
  return (str || '')
    .replace(/([A-Z])(\w)/g, (_, p1, p2) => `-${p1.toLowerCase()}${p2}`)
    .replace(/_/gm, '-');
};
/** @public */
export const kebab2camel = (str: string = '') => {
  if (!str) return '';
  return (str || '')
    .replace(/[-_](\w)/g, (_, p1) => p1.toUpperCase());
};
/** @public */
export const is32Bit = (char: string, i: number): boolean => {
  return char.codePointAt(i)! > 0xffff;
};
/** @public */
export const getCodePointLength = (str: string): number => {
  let len = 0;
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
    if (is32Bit(str, i)) i++;
    len++;
  }
  return len;
};

/** @public */
export const isAllSameChar = (str: string, char: string): boolean => {
  return new RegExp(`^(${char})\\1*$`).test(str);
};

/** @public */
export const getCharLength = (str: string): number => {
  return str.replace(/[^\x00-\xff]/g, '  ').length;
};

/** @public */
export const padStart = (str: string, length: number, char: string): string => {
  const strLen = getCodePointLength(str);
  const padding = char.repeat(Math.max(0, length - strLen));
  return padding + str;
};

/** @public */
export const padEnd = (str: string, length: number, char: string): string => {
  const strLen = getCodePointLength(str);
  const padding = char.repeat(Math.max(0, length - strLen));
  return str + padding;
};

/** @public */
export const padStartEnd = (str: string, length: number, char1: string = '', char2: string = char1): string => {
  const strLen = getCodePointLength(str);
  const paddingLen = Math.max(0, length - strLen);
  const leftPadingLen = Math.floor(paddingLen / 2);
  const rightPadingLen = paddingLen - leftPadingLen;
  return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};

/** @public */
export const emptyPadStart = (length: number, str: string = '', pad: string = ''): string => {
  return padStart(str, length, pad);
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends {} ? DeepPartial<T[P]> : T[P];
};

/** @public */
export const simpleMerge = <T extends Record<string, any>>(
  source: T,
  object: DeepPartial<T> = {},
): T => {
  const merged: T = { ...source };
  (Object.keys(source) as (keyof T)[]).forEach(key => {
    if (isObject(source[key])) {
      merged[key] = simpleMerge(
        source[key],
        object[key] as DeepPartial<T[keyof T]>,
      );
      return;
    }
    merged[key] = (object[key] || source[key]) as T[keyof T];
  });
  return merged;
};

export default {
  getType,
  isType,
  isNumber,
  isString,
  isArray,
  isObject,
  isNullable,
  is32Bit,
  getCodePointLength,
  isAllSameChar,
  getCharLength,
  padStart,
  padEnd,
  padStartEnd,
  emptyPadStart,
  simpleMerge,
};