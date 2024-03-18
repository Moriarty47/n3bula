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

export const getType = (thing: unknown): string =>
  Object.prototype.toString.call(thing).slice(8, -1).toLowerCase();

export const isType = (thing: unknown, type: ThingType): boolean =>
  getType(thing) === type.toLowerCase();

export const isNumber = (thing: unknown): thing is number => isType(thing, 'number');

export const isString = (thing: unknown): thing is string => isType(thing, 'string');

export const isBoolean = (thing: unknown): thing is boolean => isType(thing, 'boolean');

export const isBigInt = (thing: unknown): thing is bigint => isType(thing, 'bigint');

export const isSymbol = (thing: unknown): thing is symbol => isType(thing, 'symbol');

export const isNull = (thing: unknown): thing is null => isType(thing, 'null');

export const isUndefined = (thing: unknown): thing is undefined => isType(thing, 'undefined');

export const isNullable = (thing: unknown): thing is null | undefined => isNull(thing) || isUndefined(thing);

export const isPrimary = (thing: unknown): thing is PrimaryType => {
  if (thing !== null && (typeof thing === 'object' || typeof thing === 'function')) return false;
  return true;
};

export const isArray = (thing: unknown): thing is any[] => isType(thing, 'array');

export const isFunction = (thing: unknown): thing is () => void => isType(thing, 'function');

export const isObject = (thing: unknown): thing is {} => isType(thing, 'object');
