import {
  HEX_COLOR_KEYS,
  ECHO_TAG,
  HEX_COLORS,
  isDev,
  METHODS,
  Style,
  STLYE_KEYS,
  textDecoration,
  ENABLE_TRACE,
  SPACE_KEY,
  SPACE,
  ASCII_START,
  ASCII_END,
  ASCIISTYLE_KEYS,
  ASCII_Style,
  isNode,
} from './constants';

import type { Command, EchoMethod } from './types';

export const NOOP = () => {};

export function isBrowser(): boolean {
  return !!(typeof window !== 'undefined' && window?.document?.createElement);
}

export const errorLog = (...messages: any[]) => {
  console.error(`${ASCII_START}32m${ECHO_TAG}${ASCII_END}`, ...messages);
};

export const debugLog = isDev
  ? (...args: any[]) => {
      let strIdx = 0;
      const params: any[] = [];
      for (let i = 0; i < args.length; i += 1) {
        if (typeof args[i] === 'string') {
          params[strIdx] = `${params[strIdx] || ''}${params[strIdx] ? ' | ' : ''}${args[i]}`.replace(/\x1b/gi, '\\x1b');
        } else {
          strIdx++;
          params.push('|', args[i]);
        }
      }
      return console.log.bind(console, `${ASCII_START}4;53;32mDEBUG${ASCII_END}`, ...params);
    }
  : () => NOOP;

export const printStackLine = (enable?: boolean) => {
  if (!enable) return;
  const e = new Error();
  const stack = (e.stack?.split('\n')[3] || '').trim();
  let stackPath = stack.split(' ')[isNode ? 2 : 1];
  stackPath = isNode ? stackPath.slice(1, -1) : stackPath;
  console.log('↑ ' + stackPath);
};

export const sample = <T extends any>(arr: T[], k: number): T[] => {
  const n = arr.length;
  if (k <= 0) return [];
  const res = new Array(k);
  for (let i = 0; i < k; i++) {
    res[i] = arr[Math.floor(Math.random() * n)];
  }
  return res;
};

export const isNumber = (v: unknown) => typeof v === 'number';

export const isString = (v: unknown) => typeof v === 'string';

export const isHex = (value: string) => /^(#[0-9A-F]{8}|#[0-9A-F]{6}|#[0-9A-F]{4}|#[0-9A-F]{3})$/i.test(value);

export const isRgb = (value: string) => value && value.startsWith('rgb(');

export const isHsl = (value: string) => value && value.startsWith('hsl(');

export const isStaticProp = (prop: unknown) => prop === ENABLE_TRACE || prop === SPACE_KEY;

export const isMethodProp = (prop: unknown) => METHODS.some(m => m === prop);

export const isColorArgs = (arg: unknown) => arg === 'rgb' || arg === 'hsl';

export const isColorProp = (prop: unknown) => prop === 'fg' || prop === 'bg';

export const isCSSProp = (prop: unknown) => prop === 'css';

export const isStyleKey = (prop: unknown): prop is STLYE_KEYS => !!Style[prop as STLYE_KEYS];

export const isASCIIStyleKey = (prop: unknown): prop is ASCIISTYLE_KEYS => !!ASCII_Style[prop as ASCIISTYLE_KEYS];

export const isTextDecoProp = (prop: unknown) => textDecoration.has(prop as any);

export const isPresetColorProp = (prop: unknown) => !!HEX_COLORS[prop as HEX_COLOR_KEYS];

export const toNumber = (num: string | number, float = false) => {
  let val = float ? Number.parseFloat(num as string) : Number.parseInt(num as string, 10);
  if (Number.isFinite(val)) return val;
  return 0;
};

export const toFixed = (num: number, digit = 0) => Number(num.toFixed(digit));

export const hexToRgb = (color: string): [number, number, number] => {
  const fullReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = color.replace(fullReg, (_, r, g, b) => `${r}${r}${g}${g}${b}${b}`);
  const values = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  if (!values) {
    errorLog(`Unsupported [${color}] color`);
    return [0, 0, 0];
  }
  return [Number.parseInt(values[1], 16), Number.parseInt(values[2], 16), Number.parseInt(values[3], 16)];
};

export function hsl2rgb(hsl: number[]): number[] {
  let [h, s, l] = hsl;
  h /= 360;
  s /= 100;
  l /= 100;

  let val: number;
  if (s === 0) {
    val = toFixed(l * 255);
    return [val, val, val];
  }

  let t1: number, t2: number, t3: number;
  const rgb: number[] = [0, 0, 0];

  t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
  t1 = 2 * l - t2;

  for (let i = 0, len = 3; i < len; i += 1) {
    t3 = h + (1 / 3) * -(i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }
    rgb[i] = toFixed(val * 255);
  }

  return rgb;
}

const getColorNumbers = (color: string) =>
  color
    .slice(4, -1)
    .split(',')
    .map(i => Number(i.trim()));

export const getRGB = (color: string | HEX_COLOR_KEYS) => {
  let rgb: number[];
  if (isHex(color)) {
    rgb = hexToRgb(color);
  } else if (isRgb(color)) {
    rgb = getColorNumbers(color);
  } else if (isHsl(color)) {
    rgb = hsl2rgb(getColorNumbers(color));
  } else if (HEX_COLORS[color as HEX_COLOR_KEYS]) {
    rgb = hexToRgb(HEX_COLORS[color as HEX_COLOR_KEYS]);
  } else {
    rgb = [255, 255, 255];
  }
  return rgb;
};

export const fillIn = (template: string, array: any[]) => {
  const len = array.length;
  const result = template.replace(/\$(\d+)/g, (_, n) => {
    const idx = Number(n) - 1;
    return idx >= 0 && idx < len ? String(array[idx]) : '';
  });
  return result;
};

type WrapArray<T> = T extends (infer U)[] ? U : T;
export const withArray = <T>(value: T) => {
  if (Array.isArray(value)) return value as WrapArray<T>[];
  return [value] as WrapArray<T>[];
};

export class NArray<T> extends Array<T> {
  get copy() {
    return [...this];
  }
}

export class Store<T = string[]> {
  cmds: NArray<Command> = new NArray();
  fg: NArray<any> = new NArray();
  bg: NArray<any> = new NArray();
  css: NArray<T> = new NArray();
  addCmd(cmd: string) {
    this.cmds.push(cmd as Command);
  }
  addArgs(...args: any[]) {
    if (!this.cmds.length) return;
    const lastCmd = this.cmds.at(-1);
    if (!lastCmd) return;

    this[lastCmd as Command].push(...args);
  }
  addCSS(prop: string | string[][], index?: number) {
    if (!isNumber(index)) {
      this.css.push(...(prop as T[]));
      return;
    }
    this.css[index] ||= [] as T;
    (this.css[index] as string[]).push(prop as string);
  }
  clear() {
    this.cmds.length = this.fg.length = this.bg.length = this.css.length = 0;
  }
  print() {
    return [this.cmds.copy, this.fg.copy, this.bg.copy, this.css.copy];
  }
}

export const defineProperties = (echo: any, createEcho: (type: EchoMethod) => any) => {
  Object.defineProperties(echo, {
    [ENABLE_TRACE]: {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    },
    __TAG: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: ECHO_TAG,
    },
    [SPACE_KEY]: {
      configurable: false,
      enumerable: true,
      writable: false,
      value(count: number = 0) {
        count = toNumber(count);
        if (!Number.isFinite(count)) count = 0;
        if (count > 2) count -= 2;
        return SPACE.repeat(count);
      },
    },
    ...METHODS.reduce((props, m) => {
      props[m] = {
        configurable: false,
        enumerable: true,
        writable: false,
        value: createEcho(m),
      };
      return props;
    }, {} as Record<EchoMethod, any>),
  });
};
