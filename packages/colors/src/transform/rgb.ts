import { xyz2lab } from '@/transform/xyz';
import { clamp, mapRange, toFixed, epsilon4 } from '@/utils';
import { extractValues, normalizeAlpha, normalize255, isHex } from '@/utils/color';
import type { CMYK, HSL, HSV, HWB, LAB, RGB, XYZ } from '@/utils/types';

/**
 * Red, green, and blue primary colors (sRGB)
 * @example 
 * ```
 * rgb('rgb(0,0,0)'); // { r: 0, g: 0, b: 0, a: 1 }
 * rgb('rgb(255,255,255,.5)'); // { r: 255, g: 255, b: 255, a: .5 }
 * rgb('#ff0000'); // { r: 255, g: 0, b: 0, a: 1 }
 * ```
 */
export function rgb(color: string | RGB): RGB {
  if (typeof color === 'string') {
    if (isHex(color)) return hex(color);
    const values = extractValues(color);
    if (values.length === 0) return { r: 0, g: 0, b: 0, a: 0 };
    const [r, g, b, a = 1]: [number, number, number, number | undefined] = values.map((val, i) => {
      if (i < 3) {
        if (val.includes('%')) {
          return Math.round(255 * clamp(Number.parseInt(val, 10), 0, 100) / 100);
        }
        return normalize255(Number.parseInt(val, 10));
      }
      return normalizeAlpha(Number.parseFloat(val));
    }) as [number, number, number, number | undefined];
    return { r, g, b, a };
  }
  return {
    r: normalize255(color.r),
    g: normalize255(color.g),
    b: normalize255(color.b),
    a: normalizeAlpha(color.a ?? 1),
  };
}

/**
 * @param color #RGB | #RGBA | #RRGGBB | #RRGGBBAA
 */
export function hex(color: `#${string}`): RGB {
  if (color.length === 4 || color.length === 5) {
    color = '#' + color.slice(1)
      .replace(/(.)/g, '$1$1') as `#${string}`;
  }

  return {
    r: Number.parseInt(color.slice(1, 3), 16),
    g: Number.parseInt(color.slice(3, 5), 16),
    b: Number.parseInt(color.slice(5, 7), 16),
    a: color.length === 9
      ? Number.parseFloat((Number.parseInt(color.slice(7, 9), 16) / 255).toFixed(2))
      : 1,
  };
}

export function rgb2hex(rgb: RGB): `#${string}` {
  return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}${rgb.a === 1 ? '' : rgb.a != null ? Math.round(mapRange(0.0, 1.0, 0, 256, rgb.a)).toString(16) : ''}`;
}

/**
 * `R' = R / 255`\
 * `G' = G / 255`\
 * `B' = B / 255`\
 * `K = 1 - max(R',G',B')`\
 * `C = (1 - R' - K) / (1 - K)`\
 * `M = (1 - G' - K) / (1 - K)`\
 * `Y = (1 - B' - K) / (1 - K)`
 */
export function rgb2cmyk(rgb: RGB): CMYK {
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  let k = Math.min(1 - r, 1 - g, 1 - b);
  let k1 = 1 - k;
  return {
    c: Math.round(((k1 - r) / k1 || 0) * 100),
    m: Math.round(((k1 - g) / k1 || 0) * 100),
    y: Math.round(((k1 - b) / k1 || 0) * 100),
    k: Math.round(k * 100),
  };
}

/**
 * NTSC formula: `0.299 * Red + 0.587 * Green + 0.114 * Blue`
 */
export function rgb2grayscale(rgb: RGB): number {
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1_000;
}

export function rgb2hsl(rgb: RGB): HSL {
  let { r, g, b, a } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  a = normalizeAlpha(a);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = max - min;
  const l = (max + min) / 2;
  if (c === 0) return { h: 0, s: 0, l: Math.round(l * 100), a };
  let h =
    (max === r
      ? ((g - b) / c) % 6
      : max === g
        ? (b - r) / c + 2
        : (r - g) / c + 4) * 60;
  if (h < 0) {
    h += 360;
  }
  const s = Math.round((c / (1 - Math.abs(2 * l - 1))) * 100);
  return { h: Math.round(h), s, l: Math.round(l * 100), a };
}

export function rgb2hsv(rgb: RGB): HSV {
  let { r, g, b, a } = rgb;
  a = normalizeAlpha(a);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = max - min;
  const v = Math.round(((max / 255) * 1000) / 10);
  if (c === 0) return { h: 0, s: 0, v, a };
  let h =
    (max === r
      ? ((g - b) / c) % 6
      : max === g
        ? (b - r) / c + 2
        : (r - g) / c + 4) * 60;
  if (h < 0) {
    h += 360;
  }
  const s = Math.round(((c / max) * 1000) / 10);
  return { h: Math.round(h), s, v, a };
}

export function rgb2hwb(rgb: RGB): HWB {
  let { r, g, b, a } = rgb;
  const h = rgb2hsl(rgb).h;
  const w = Math.round(1 / 255 * Math.min(r, Math.min(g, b)) * 100);
  b = Math.round((1 - 1 / 255 * Math.max(r, Math.max(g, b))) * 100);
  return { h, w, b, a: normalizeAlpha(a) };
}

export function rgb2xyz(rgb: RGB): XYZ {
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : (r / 12.92);
  g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : (g / 12.92);
  b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : (b / 12.92);

  return {
    x: epsilon4(toFixed((r * 0.4124564) + (g * 0.3575761) + (b * 0.1804375), 3)),
    y: epsilon4(toFixed((r * 0.2126729) + (g * 0.7151522) + (b * 0.0721750), 3)),
    z: epsilon4(toFixed((r * 0.0193339) + (g * 0.1191920) + (b * 0.9503041), 3)),
  };
}

export function rgb2lab(rgb: RGB): LAB {
  return xyz2lab(rgb2xyz(rgb));
}