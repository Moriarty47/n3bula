import { hsl } from '@/transform/hsl';
import { normalizeAlpha } from '@/utils/color';
import type { HSL, HSV, RGB } from '@/utils/types';

/**
 * Hue, saturation, and value
 * also called HSB (B for brightness)
 */
export function hsv(color: string | HSV): HSV {
  const { h, s, l: v, a } = hsl(color as string | HSL);
  return { h, s, v, a };
}

export function hsv2hsl(hsv: HSV): HSL {
  let { h, s, v, a } = hsv;
  s /= 100;
  v /= 100;
  a = normalizeAlpha(a);

  let l = (2 - s) * v;
  let sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;

  return { h, s: Math.round(sl * 100), l: Math.round(l * 100), a };
}

export function hsv2rgb(hsv: HSV): RGB {
  let { h, s, v, a } = hsv;
  h /= 60;
  s /= 100;
  v /= 100;
  a = normalizeAlpha(a);
  const hi = Math.floor(h) % 6;

  v = 255 * v;
  const f = h - Math.floor(h);
  const p = Math.round(v * (1 - s));
  const q = Math.round(v * (1 - (s * f)));
  const t = Math.round(v * (1 - (s * (1 - f))));
  v = Math.round(v);

  switch (hi) {
    case 0: return { r: v, g: t, b: p, a };
    case 1: return { r: q, g: v, b: p, a };
    case 2: return { r: p, g: v, b: t, a };
    case 3: return { r: p, g: q, b: v, a };
    case 4: return { r: t, g: p, b: v, a };
    case 5: return { r: v, g: p, b: q, a };
    default: return { r: 0, g: 0, b: 0, a };
  }
}