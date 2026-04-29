import {
  ASCII_END,
  ASCII_START,
  AsciiStyle,
  ECHO_TAG,
  EchoMethods,
  ENABLE_TRACE,
  HexColors,
  isDev,
  Style,
  StyleMethods,
} from './constants';

import type { PropertiesHyphen } from 'csstype';
import type {
  AsciiStyleKeyType,
  EchoMethodType,
  HexColorKeyType,
  StyleKeyType,
  StyleMethodType,
} from './types';

export const NOOP = () => {};
export const echoTag = () => ECHO_TAG;

export const errorLog = (...messages: any[]) => {
  console.error(`${ASCII_START}32m${ECHO_TAG}${ASCII_END}`, ...messages);
};

export const debugLog = isDev
  ? (...args: any[]) => {
      let strIdx = 0;
      const params: any[] = [];
      for (let i = 0; i < args.length; i += 1) {
        if (typeof args[i] === 'string') {
          params[strIdx] =
            `${params[strIdx] || ''}${params[strIdx] ? ' $ ' : ''}${args[i]}`.replace(
              /\x1b/gi,
              '\\x1b',
            );
        } else {
          strIdx++;
          params.push(' $ ', args[i]);
        }
      }
      return console.log.bind(
        console,
        `${ASCII_START}4;53;32mDEBUG${ASCII_END}`,
        ...params,
      );
    }
  : () => NOOP;

export const printStackLine = (level = 4) => {
  if (!GLOBAL_CONFIGS[ENABLE_TRACE]) return;
  const e = new Error();
  const stack = (e.stack?.split('\n')[level] || '').trim();
  const stackPath = stack.match(/(\w+:[^())]*)/)?.[0];
  console.log(`⬇️ ${stackPath}`);
};

export const sample = <T>(arr: T[], k: number): T[] => {
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

export const isSymbol = (v: unknown) => typeof v === 'symbol';

export const isHex = (value: string) =>
  /^(#[0-9A-F]{8}|#[0-9A-F]{6}|#[0-9A-F]{4}|#[0-9A-F]{3})$/i.test(value);

export const isRgb = (value: string) => !!value?.startsWith('rgb(');

export const isHsl = (value: string) => !!value?.startsWith('hsl(');

export const isMethodProp = (prop: unknown) => EchoMethods.has(prop as any);

export const isColorProp = (prop: unknown) => prop === 'fg' || prop === 'bg';

export const isCSSProp = (prop: unknown) => prop === 'css';

export const isStyleKey = (prop: unknown): prop is StyleKeyType =>
  !!Style[prop as StyleKeyType];

export const isAsciiStyleKey = (prop: unknown): prop is AsciiStyleKeyType =>
  !!AsciiStyle[prop as AsciiStyleKeyType];

export const toNumber = (num: string | number, float = false) => {
  const val = float
    ? Number.parseFloat(num as string)
    : Number.parseInt(num as string, 10);
  if (Number.isFinite(val)) return val;
  return 0;
};

export const toFixed = (num: number, digit = 0) => Number(num.toFixed(digit));

export const hexToRgb = (color: string): [number, number, number] => {
  const fullReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = color.replace(
    fullReg,
    (_, r, g, b) => `${r}${r}${g}${g}${b}${b}`,
  );
  const values = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  if (!values) {
    errorLog(`Unsupported [${color}] color`);
    return [0, 0, 0];
  }
  return [
    Number.parseInt(values[1], 16),
    Number.parseInt(values[2], 16),
    Number.parseInt(values[3], 16),
  ];
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

export const getRGB = (color: string | HexColorKeyType) => {
  let rgb: number[];
  if (isHex(color)) {
    rgb = hexToRgb(color);
  } else if (isRgb(color)) {
    rgb = getColorNumbers(color);
  } else if (isHsl(color)) {
    rgb = hsl2rgb(getColorNumbers(color));
  } else if (HexColors[color as HexColorKeyType]) {
    rgb = hexToRgb(HexColors[color as HexColorKeyType]);
  } else {
    rgb = [255, 255, 255];
  }
  return rgb;
};

export const isStyleMethod = (prop: any): prop is StyleMethodType =>
  StyleMethods.has(prop);

export const isEchoMethod = (prop: any): prop is EchoMethodType =>
  EchoMethods.has(prop);

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function truthy<T>(v: T): boolean {
  return !!v;
}

export const GLOBAL_CONFIGS = {
  [ENABLE_TRACE]: false,
};

export function getBase64Image(
  url: string,
  height: number = 100,
): Promise<PropertiesHyphen> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.height = height || image.naturalHeight;
      canvas.width = (height * image.naturalWidth) / image.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL();
      resolve({
        background: `url(${dataUrl}) no-repeat`,
        'background-size': 'cover',
        'font-size': '1px',
        padding: `${canvas.height}px ${canvas.width}px`,
      });
    };
    image.onerror = reject;
    image.src = url;
  });
}

export const stringifyCSS = (css: PropertiesHyphen) =>
  Object.keys(css).reduce(
    (cssStr, key) =>
      (cssStr += `${key}:${css[key as keyof PropertiesHyphen]};`),
    '',
  );
