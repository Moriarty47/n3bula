import { access, rename as fsRename, constants } from 'fs/promises';

import type { PathLike } from 'fs';

export const NOOP = () => {};

export const getNow = () => Date.now();

export const isNumber = (v: unknown) => typeof v === 'number';

export const toInt = (v: string) => parseInt(v, 10);

export function assert(expectedCondition: unknown, message: string): asserts expectedCondition {
  if (!expectedCondition) {
    throw new Error(message);
  }
}

export const exists = async (filePath: string) => {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {}
  return false;
};

export const rename = async (oldPath: PathLike, newPath: PathLike) => {
  try {
    await fsRename(oldPath, newPath);
    return [null, true] as const;
  } catch (err) {
    return [err, null] as const;
  }
};

export type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

export const useDefer = <T>() => {
  const deferred = {} as Deferred<T>;
  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};
