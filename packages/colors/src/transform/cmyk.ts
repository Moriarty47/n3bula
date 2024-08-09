import { clamp } from '@/utils';
import { extractValues } from '@/utils/color';
import type { CMYK, RGB } from '@/utils/types';

/**
 * Cyan, Magenta, Yellow and Black
 */
export function cmyk(color: string | CMYK): CMYK {
  if (typeof color === 'string') {
    const values = extractValues(color);
    if (values.length === 0) return { c: 0, m: 0, y: 0, k: 0 };
    const [c, m, y, k] = values.map((val) => clamp(parseFloat(val), 0, 100));
    return { c, m, y, k };
  }
  return {
    c: clamp(color.c, 0, 100),
    m: clamp(color.m, 0, 100),
    y: clamp(color.y, 0, 100),
    k: clamp(color.k, 0, 100),
  };
}

/**
 * `R = 255 * (1 - C) * (1 - K)`\
 * `G = 255 * (1 - M) * (1 - K)`\
 * `B = 255 * (1 - Y) * (1 - K)`
 */
export function cmyk2rgb(cmyk: CMYK): RGB {
  let { c, m, y, k } = cmyk;
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;
  
  return {
    r: Math.round(255 * (1 - Math.min(1, c * (1 - k) + k))),
    g: Math.round(255 * (1 - Math.min(1, m * (1 - k) + k))),
    b: Math.round(255 * (1 - Math.min(1, y * (1 - k) + k))),
    a: 1,
  };
}