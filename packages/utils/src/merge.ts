import { isObject } from './is';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends {} ? DeepPartial<T[P]> : T[P];
};

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