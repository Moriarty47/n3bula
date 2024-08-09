import type { RGB, HSL, HSV, HWB, CMYK, XYZ, LAB, LCH } from '@/utils/types';

export type V = string | number[];

export function transformer<Input, Output>(
  data: [V, V][],
  formatter: (v: V) => Input
): { v: Input, e: Output; }[];
export function transformer<Input, Output>(
  data: [V, V][],
  vFormatter: (v: V) => Input,
  eFormatter: (e: V) => Output,
): { v: Input, e: Output; }[];
export function transformer<Input, Output>(
  data: [V, V][],
  vFormatter: (v: V) => Input,
  eFormatter: (e: V) => Output = vFormatter as any,
): { v: Input, e: Output; }[] {

  return data.map(([v, e]) => {
    return { v: vFormatter(v), e: eFormatter(e) };
  });
}

interface Formatter<T> {
  string(v: T): string;
  number(v: T): number;
  rgb(v: string): string;
  rgb(v: number[]): RGB;
  rgb(v: T): RGB;
  rgb(v: T): string | RGB;
  hsl(v: string): string;
  hsl(v: number[]): HSL;
  hsl(v: T): HSL;
  hsl(v: T): string | HSL;
  hsv(v: string): string;
  hsv(v: number[]): HSV;
  hsv(v: T): HSV;
  hsv(v: T): string | HSV;
  hwb(v: string): string;
  hwb(v: number[]): HWB;
  hwb(v: T): HWB;
  hwb(v: T): string | HWB;
  xyz(v: string): string;
  xyz(v: number[]): XYZ;
  xyz(v: T): XYZ;
  xyz(v: T): string | XYZ;
  lab(v: string): string;
  lab(v: number[]): LAB;
  lab(v: T): LAB;
  lab(v: T): string | LAB;
  lch(v: string): string;
  lch(v: number[]): LCH;
  lch(v: T): LCH;
  lch(v: T): string | LCH;
  cmyk(v: string): string;
  cmyk(v: number[]): CMYK;
  cmyk(v: T): CMYK;
  cmyk(v: T): string | CMYK;
}

export const formatters: Formatter<V> = {
  string(v): string { return v as string; },
  number(v): number { return Number(v[0]); },
  rgb(v): any {
    if (typeof v === 'string') return v;
    const [r, g, b, a] = v;
    return { r, g, b, a };
  },
  hsl(v): any {
    if (typeof v === 'string') return v;
    const [h, s, l, a] = v;
    return { h, s, l, a };
  },
  hsv(v): any {
    if (typeof v === 'string') return v;
    const [h, s, _v, a] = v;
    return { h, s, v: _v, a };
  },
  hwb(v): any {
    if (typeof v === 'string') return v;
    const [h, w, b, a] = v;
    return { h, w, b, a };
  },
  xyz(v): any {
    if (typeof v === 'string') return v;
    const [x, y, z] = v;
    return { x, y, z };
  },
  lab(v): any {
    if (typeof v === 'string') return v;
    const [l, a, b] = v;
    return { l, a, b };
  },
  lch(v): any {
    if (typeof v === 'string') return v;
    const [l, c, h] = v;
    return { l, c, h };
  },
  cmyk(v): any {
    if (typeof v === 'string') return v;
    const [c, m, y, k] = v;
    return { c, m, y, k };
  }
};