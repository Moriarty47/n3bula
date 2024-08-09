import { clamp, epsilon3, epsilon4, toFixed } from '@/utils';
import { extractValues } from '@/utils/color';
import type { LAB, RGB, XYZ } from '@/utils/types';

export function xyz(color: string | XYZ): XYZ {
  if (typeof color === 'string') {
    const values = extractValues(color);
    if (values.length === 0) return { x: 0, y: 0, z: 0 };
    const [x, y, z] = values.map(val => clamp(parseFloat(val), 0, 100));

    return {
      x: epsilon3(toFixed(x, 3)),
      y: epsilon3(toFixed(y, 3)),
      z: epsilon3(toFixed(z, 3)),
    };
  }

  return {
    x: clamp(color.x, 0, 100),
    y: clamp(color.y, 0, 100),
    z: clamp(color.z, 0, 100),
  };
}

export function xyz2rgb(xyz: XYZ): RGB {
  let { x, y, z } = xyz;

  let r = (x * 3.2404542) + (y * -1.5371385) + (z * -0.4985314);
  let g = (x * -0.9692660) + (y * 1.8760108) + (z * 0.0415560);
  let b = (x * 0.0556434) + (y * -0.2040259) + (z * 1.0572252);

  r = r > 0.0031308 ? ((1.055 * (r ** (1 / 2.4))) - 0.055) : (r * 12.92);
  g = g > 0.0031308 ? ((1.055 * (g ** (1 / 2.4))) - 0.055) : (g * 12.92);
  b = b > 0.0031308 ? ((1.055 * (b ** (1 / 2.4))) - 0.055) : (b * 12.92);

  return {
    r: Math.round(clamp(r, 0, 1) * 255),
    g: Math.round(clamp(g, 0, 1) * 255),
    b: Math.round(clamp(b, 0, 1) * 255),
    a: 1,
  };
}

export function xyz2lab(xyz: XYZ): LAB {
  let { x, y, z } = xyz;

  x /= 0.95047;
  y /= 1.0000;
  z /= 1.08883;

  x = x > 0.008856 ? x ** (1 / 3) : ((7.787 * x) + (16 / 116));
  y = y > 0.008856 ? y ** (1 / 3) : ((7.787 * y) + (16 / 116));
  z = z > 0.008856 ? z ** (1 / 3) : ((7.787 * z) + (16 / 116));

  return {
    l: epsilon4(toFixed(((116 * y) - 16), 2)),
    a: epsilon4(toFixed((500 * (x - y)), 2)),
    b: epsilon4(toFixed((200 * (y - z)), 2)),
  };
}