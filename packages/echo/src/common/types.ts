import { HEX_COLOR_KEYS } from './constants';

export type EchoMethod = 'log' | 'info' | 'warn' | 'trace' | 'error';

export type MaybePromise<T = void> = Promise<T> | T;

export type CallRun<R = void> = {
  (...args: any[]): R;
};

export type Command = 'css' | 'fg' | 'bg';

export type Color = (string & {}) | HEX_COLOR_KEYS;
