import { hsl2rgb, hsl2hsv, hsv2hsl, rgb2hex, rgb2cmyk, cmyk2rgb, rgb2hsv, hex } from '@n3bula/colors';

export type CMYK = { c: number, m: number, y: number, k: number; };
export type RGB = { r: number, g: number, b: number, a?: number; };
export type HSL = { h: number, s: number, l: number, a?: number; };
export type HSV = { h: number, s: number, v: number, a?: number; };
export type HEX = string | number;

export function toFixed(num: number, digits: number = 0) {
  const fixed = num.toFixed(digits);
  if (digits === 0) {
    return Number(fixed);
  }
  const dot = fixed.indexOf(".");
  if (dot >= 0) {
    const zerosMatch = fixed.match(/0+$/);
    if (zerosMatch) {
      if (zerosMatch.index === dot + 1) {
        return Number(fixed.substring(0, dot));
      }
      return Number(fixed.substring(0, zerosMatch.index));
    }
  }
  return Number(fixed);
};

export const colorTypes = ['HEX', 'RGB', 'CMYK', 'HSV', 'HSL'] as const;
export type ColorType = typeof colorTypes[number];
export type ColorSet = HEX | RGB | CMYK | HSV | HSL;

const hsl2ColorStrings: Record<ColorType, (color: HSL) => string> = {
  CMYK: (hsl) => hsl2cmykString(hsl),
  RGB: (hsl) => hsl2rgbString(hsl),
  HSL: (hsl) => hsl2String(hsl),
  HSV: (hsl) => hsl2hsvString(hsl),
  HEX: (hsl) => rgb2hex(hsl2rgb(hsl)),
};

export const transformColor = (hsv?: HSV) => colorTypes.reduce((value, type) => {
  if (type === 'HSV') {
    value[type] = hsv2String(hsv);
    return value;
  }
  value[type] = hsv ? hsl2ColorStrings[type](hsv2hsl(hsv)) : '';
  return value;
}, {} as Record<ColorType, string>);

export function hsl2String(hsl?: HSL): string {
  if (!hsl) return '';
  const { h, s, l } = hsl;
  return `${toFixed(h)}°, ${toFixed(s)}%, ${toFixed(l)}%`;
}

export function hsv2String(hsv?: HSV): string {
  if (!hsv) return '';
  const { h, s, v } = hsv;
  return `${toFixed(h)}°, ${toFixed(s)}%, ${toFixed(v)}%`;
}

export function hsl2rgbString(hsl?: HSL): string {
  if (!hsl) return '';
  const { r, g, b } = hsl2rgb(hsl);
  return `${toFixed(r)}, ${toFixed(g)}, ${toFixed(b)}`;
}

export function hsl2hsvString(hsl?: HSL): string {
  if (!hsl) return '';
  const { h, s, v } = hsl2hsv(hsl);
  return `${toFixed(h)}°, ${toFixed(s)}%, ${toFixed(v)}%`;
}

export function hsl2cmykString(hsl?: HSL): string {
  if (!hsl) return '';
  const { c, m, y, k } = rgb2cmyk(hsl2rgb(hsl));
  return `${toFixed(c)}%, ${toFixed(m)}%, ${toFixed(y)}%, ${toFixed(k)}%`;
}

function extractValues(color: string): string[] {
  const colors = color.match(/-?\d+(\.\d+)?%?/g);
  if (!colors) return [];
  return colors;
}

function isHex(color: string): color is `#${string}` {
  return /^#([0-9A-F]{8}|[0-9A-F]{6}|[0-9A-F]{4}|[0-9A-F]{3})$/i.test(color);
}

const formatters: Record<ColorType | '_HS', (target: string, source: string) => { value: string; hsv?: HSV; }> = {
  CMYK(target, source) {
    const values = extractValues(target);
    const sourceValues = extractValues(source).map(val => parseFloat(val));
    const [c, m, y, k] = values.map((val, idx) => {
      const v = parseFloat(val);
      if (v >= 0 && v <= 100 && v !== sourceValues[idx]) {
        return v;
      }
      return sourceValues[idx];
    });
    return {
      value: `${toFixed(c)}%, ${toFixed(m)}%, ${toFixed(y)}%, ${toFixed(k)}%`,
      hsv: rgb2hsv(cmyk2rgb({ c, m, y, k })),
    };
  },
  HEX(target, source) {
    const value = isHex(target) ? target : source;
    return {
      value,
      hsv: rgb2hsv(hex(value as `#${string}`)),
    };
  },
  HSL(target, source) {
    return this._HS(target, source);
  },
  HSV(target, source) {
    return this._HS(target, source);
  },
  _HS(target, source) {
    const values = extractValues(target);
    const sourceValues = extractValues(source).map(val => parseFloat(val));
    const [h, s, l] = values.map((val, idx) => {
      const v = parseFloat(val);
      if (idx === 0) {
        if (v >= 0 && v <= 360 && v !== sourceValues[idx]) {
          return v;
        }
      } else {
        if (v >= 0 && v <= 100 && v !== sourceValues[idx]) {
          return v;
        }
      }
      return sourceValues[idx];
    });
    return {
      value: `${toFixed(h)}°, ${toFixed(s)}%, ${toFixed(l)}%`,
      hsv: hsl2hsv({ h, s, l }),
    };
  },
  RGB(target, source) {
    const values = extractValues(target);
    const sourceValues = extractValues(source).map(val => parseFloat(val));
    const [r, g, b] = values.map((val, idx) => {
      const v = parseFloat(val);
      if (v >= 0 && v <= 255 && v !== sourceValues[idx]) {
        return v;
      }
      return sourceValues[idx];
    });
    return {
      value: `${toFixed(r)}, ${toFixed(g)}, ${toFixed(b)}`,
      hsv: rgb2hsv({ r, g, b }),
    };
  }
};

export function formatChangedValue(type: ColorType, target: string, source: string): { value: string; hsv?: HSV; } {
  if (target === source) return { value: source };

  return formatters[type](target, source);
}