import { isObject } from './is';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, any> ? DeepPartial<T[P]> : T[P];
};

export type UnionToIntersection<T> =
  (T extends any ? (k: T) => void : never) extends ((k: infer U) => void) ? U : never;

export const simpleMerge = <T extends Record<string, any>>(
  source: T,
  object: DeepPartial<T> = {},
): T => {
  const merged: T = { ...source };
  (Object.keys(source) as (keyof T)[]).forEach(key => {
    if (isObject(source[key])) {
      merged[key] = simpleMerge(
        source[key],
        object[key] as DeepPartial<T[keyof T]>,
      );
      return;
    }
    merged[key] = (object[key] || source[key]) as T[keyof T];
  });
  return merged;
};

export const assignMerge = <T extends Record<string, any>, U extends Array<Record<string, any>>>(target: T, ...rest: U): T & UnionToIntersection<U[number]> => {
  for (let i = 0, len = rest.length; i < len; i += 1) {
    const source = rest[i];
    (Object.keys(source) as (keyof T)[]).forEach(key => {
      target[key] = source[key as string] as T[keyof T];
    });
  }
  return target as T & UnionToIntersection<U[number]>;
};


export default {
  simpleMerge,
  assignMerge,
};