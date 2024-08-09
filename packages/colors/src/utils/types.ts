import { colorType } from '@/utils/constants';

export type AnyFunc<T extends unknown = any> = (this: T, ...rest: any[]) => any;

export type PromiseValue<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends ((x: infer I) => void)
  ? I
  : never;

export type KeyOf<T> = keyof T;

export type ValueOf<T> = T[KeyOf<T>];

export type ColorType = (typeof colorType)[number];
export type ColorArray = [number, number, number, number?];

export type RGB = { r: number, g: number, b: number, a?: number; };
export type XYZ = { x: number, y: number, z: number; };
export type LAB = { l: number, a: number, b: number; };
export type LCH = { l: number, c: number, h: number; };
export type HSL = { h: number, s: number, l: number, a?: number; };
export type HSV = { h: number, s: number, v: number, a?: number; };
export type HWB = { h: number, w: number, b: number, a?: number; };
export type CMYK = { c: number, m: number, y: number, k: number; };
