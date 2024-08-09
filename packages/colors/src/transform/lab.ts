import { clamp, epsilon2, epsilon3, toFixed } from '@/utils';
import { extractValues } from '@/utils/color';
import type { LAB, LCH, XYZ } from '@/utils/types';

/**
 * Lightness, Cartesian coordinates a and b
 */
export function lab(color: string | LAB): LAB {
  if (typeof color === 'string') {
    const values = extractValues(color);
    if (values.length === 0) return { l: 0, a: 0, b: 0 };
    const [l, a, b] = values.map((val, i) => i === 0
      ? clamp(parseFloat(val), 0, 100)
      : clamp(parseFloat(val), -128, 128));

    return {
      l: epsilon2(toFixed(l, 2)),
      a: epsilon2(toFixed(a, 2)),
      b: epsilon2(toFixed(b, 2)),
    };
  }

  return {
    l: clamp(color.l, 0, 100),
    a: clamp(color.a, -128, 128),
    b: clamp(color.b, -128, 128),
  };
}

export function lab2xyz(lab: LAB): XYZ {
  const { l, a, b } = lab;
  let x;
  let y;
  let z;

  y = (l + 16) / 116;
  x = a / 500 + y;
  z = y - b / 200;

  const y2 = y ** 3;
  const x2 = x ** 3;
  const z2 = z ** 3;
  y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
  x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
  z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

  return {
    x: epsilon3(toFixed(x * 0.95047, 3)),
    y: epsilon3(toFixed(y, 3)),
    z: epsilon3(toFixed(z * 1.08883, 3)),
  };
}

export function lab2lch(lab: LAB): LCH {
  const { l, a, b } = lab;
  let h = Math.atan2(b, a) * 360 / 2 / Math.PI;

  if (h < 0) h += 360;

  const c = Math.sqrt(a ** 2 + b ** 2);

  return {
    l: epsilon2(toFixed(l, 2)),
    c: epsilon2(toFixed(c, 2)),
    h: epsilon2(toFixed(h, 2)),
  };
}