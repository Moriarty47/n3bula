import { clamp, epsilon2, toFixed } from '@/utils';
import { extractValues, normalizeAlpha } from '@/utils/color';
import { HWB, RGB } from '@/utils/types';

/**
 * Hue, Whiteness and Blackness
 */
export function hwb(color: string | HWB): HWB {
  if (typeof color === 'string') {
    const values = extractValues(color);
    if (values.length === 0) return { h: 0, w: 0, b: 0 };
    const [h, w, b] = values.map((val, i) => i === 0
      ? clamp(parseFloat(val), 0, 360)
      : clamp(parseFloat(val), 0, 100));

    return {
      h: epsilon2(toFixed(h, 2)),
      w: epsilon2(toFixed(w, 2)),
      b: epsilon2(toFixed(b, 2)),
      a: 1,
    };
  }

  return {
    h: clamp(color.h, 0, 360),
    w: clamp(color.w, 0, 100),
    b: clamp(color.b, 0, 100),
    a: 1,
  };
}

export function hwb2rgb(hwb: HWB): RGB {
  let { h, w, b, a } = hwb;
  h /= 360;
  w /= 100;
  b /= 100;
  a = normalizeAlpha(a);
  const ratio = w + b;

  if (ratio > 1) {
    w /= ratio;
    b /= ratio;
  }

  const i = Math.floor(6 * h);
  const v = 1 - b;
  let f = 6 * h - i;

  if ((i & 0x01) !== 0) f = 1 - f;

  const n = w + f * (v - w);

  let r: number, g: number;
  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = w; break;
    case 1: r = n; g = v; b = w; break;
    case 2: r = w; g = v; b = n; break;
    case 3: r = w; g = n; b = v; break;
    case 4: r = n; g = w; b = v; break;
    case 5: r = v; g = w; b = n; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a,
  };
}