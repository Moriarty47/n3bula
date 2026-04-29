(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export const TAG = '@n3bula/express';

export const SPACE = ' ';

export const NOOP = () => {};

export const ERROR_TYPE = {
  RequiredError: 'RequiredError',
  ValidateError: 'ValidateError',
};

export const SYMBOL_METADATA = Symbol('Symbol.metadata');

export const ROUTE_CLASS = Symbol('ROUTE_CLASS');

export const ROUTE_CLASS_NAME = Symbol('ROUTE_CLASS_NAME');

export const ROUTE_PREFIX = Symbol('ROUTE_PREFIX');

export const ROUTE_MIDDLEWARES = Symbol('ROUTE_MIDDLEWARES');

export const VALIDATE_HAS_WRAPPED = Symbol('VALIDATE_HAS_WRAPPED');

export const ROUTE_HAS_WRAPPED = Symbol('ROUTE_HAS_WRAPPED');
