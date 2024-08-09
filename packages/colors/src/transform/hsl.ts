import { clamp, toFixed } from '@/utils';
import { extractValues, normalize100, normalize360, normalizeAlpha, normalizeHue } from '@/utils/color';
import type { HSL, HSV, RGB } from '@/utils/types';

/**
 * Hue, saturation, and lightness
 * also called HLS
 */
export function hsl(color: string | HSL): HSL {
  if (typeof color === 'string') {
    const values = extractValues(color);
    if (values.length === 0) return { h: 0, s: 0, l: 0, a: 0 };
    const converters = [360, 100, 100, 1];
    const [h, s, l, a = 1] = values.map((v, i) => {
      let val = Number.parseFloat(v);
      // Normalize hue to [0, 360]
      if (i === 0) val = normalizeHue(val);

      return clamp(val, 0, converters[i]);
    }
    );
    return { h, s, l, a: normalizeAlpha(a) };
  }
  return {
    h: normalize360(normalizeHue(color.h)),
    s: normalize100(color.s),
    l: normalize100(color.l || (color as any).v),
    a: normalizeAlpha(color.a ?? 1),
  };
}

export function hsl2hsv(hsl: HSL): HSV {
  let { h, s, l, a } = hsl;
  l /= 100;
  // no need to do calc on black also avoids divide by 0 error
  if (l === 0) return { h: 0, s: 0, v: 0, a };

  s /= 100;
  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  const v = (l + s) / 2;
  const sv = s / v;
  return { h, s: toFixed(sv * 100, 1), v: toFixed(v * 100, 1), a };
}

export function hsl2rgb(hsl: HSL): RGB {
  let { h, s, l, a } = hsl;
  h /= 360;
  s /= 100;
  l /= 100;
  a = normalizeAlpha(a);

  let val: number;
  if (s === 0) {
    val = l * 255;
    return { r: val, g: val, b: val, a };
  }

  let t1: number, t2: number, t3: number;
  const rgb: RGB = { r: 0, g: 0, b: 0, a };

  t2 = l < .5 ? l * (1 + s) : l + s - l * s;
  t1 = 2 * l - t2;

  const temp: Exclude<keyof RGB, 'a'>[] = ['r', 'g', 'b'];
  for (let i = 0, len = temp.length; i < len; i += 1) {
    t3 = h + 1 / 3 * - (i - 1);
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
    rgb[temp[i]] = toFixed(val * 255);
  }

  return rgb;
}

export function hsl2string(hsl: HSL): string {
  let { h, s, l, a } = hsl;
  h = Math.round(h);
  s = Math.round(s);
  l = Math.round(l);
  a = normalizeAlpha(a);
  const hasA = a !== undefined;
  return `hsl${hasA ? 'a' : ''}(${h},${s}%,${l}%${hasA ? `,${a}` : ''})`;
}