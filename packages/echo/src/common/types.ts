import type { AsciiStyle, CssProp, HexColors, Style } from './constants';

export type AnyFunc<T = void> = (...args: any[]) => T;

export type CallRun<R = void> = AnyFunc<R> & {
  toString: AnyFunc<string>;
  valueOf: AnyFunc<string>;
};

export type EchoMethodType = 'log' | 'info' | 'warn' | 'trace' | 'error';

export type StyleMethodType = 'css' | 'fg' | 'bg';

export type CssPropType = keyof typeof CssProp;

export type StyleKeyType = keyof typeof Style;

export type AsciiStyleKeyType = keyof typeof AsciiStyle;

export type HexColorKeyType = keyof typeof HexColors;

export type Color = (string & {}) | HexColorKeyType;
