import { clamp, epsilon2, toFixed } from '@/utils';
import { extractValues } from '@/utils/color';
import type { LAB, LCH } from '@/utils/types';

/**
 * Lightness, Chroma(saturation,colourfulness) and Hue
 */
export function lch(color: string | LCH): LCH {
  if (typeof color === 'string') {
    const values = extractValues(color);
    if (values.length === 0) return { l: 0, c: 0, h: 0 };
    const [l, c, h] = values.map((val, i) => i === 2
      ? clamp(parseFloat(val), 0, 360)
      : clamp(parseFloat(val), 0, 100));

    return {
      l: epsilon2(toFixed(l, 2)),
      c: epsilon2(toFixed(c, 2)),
      h: epsilon2(toFixed(h, 2)),
    };
  }

  return {
    l: clamp(color.l, 0, 100),
    c: clamp(color.c, 0, 100),
    h: clamp(color.h, 0, 360),
  };
}

export function lch2lab(lch: LCH): LAB {
  const { l, c, h } = lch;

  const hr = h / 360 * 2 * Math.PI;
  return {
    l: epsilon2(toFixed((l), 2)),
    a: epsilon2(toFixed((c * Math.cos(hr)), 2)),
    b: epsilon2(toFixed((c * Math.sin(hr)), 2)),
  };
}