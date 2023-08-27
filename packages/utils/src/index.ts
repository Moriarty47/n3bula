type thingType = readonly [
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
];

type ThingType = thingType[number] | (string & {});

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
export const isArray = (thing: unknown): thing is any[] => isType(thing, 'array');
/** @public */
export const isObject = (thing: unknown): thing is {} => isType(thing, 'object');
/** @public */
export const isNullable = (thing: unknown): thing is null | undefined => isType(thing, 'null') || isType(thing, 'undefined');

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
};