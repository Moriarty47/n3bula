import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const isDev = process.env.NOVA_MODE === 'DEV';

export const cwd = process.cwd();

export const __dirname = dirname(fileURLToPath(import.meta.url));

export function assertsDefined<T>(value: T | undefined | null, msg?: any): asserts value is T {
  if (!value) throw new Error(msg || 'Value is not defined.');
}

export function assertsError<T>(value: T | null, payload?: any): asserts value is null {
  if (value) throw payload;
}

export type RejectedResult = [Error, null];
export type ResolvedResult<T> = [null, T];
export type Result<T> = RejectedResult | ResolvedResult<T>;

export const withResult = <T>(result: T): ResolvedResult<T> => [null, result];
export const catchError = (error: any): RejectedResult => [error, null];

type SecondLevelKeys<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? keyof T[K] : never }[keyof T]
  : never;

type PickSecondLevel<T, K extends SecondLevelKeys<T>> = {
  [P in keyof T]: T[P] extends object ? Omit<T[P], K> : never;
};

export function filterKeys<T extends Record<string, any>, K extends SecondLevelKeys<T>>(
  obj: T,
  keys: readonly (K | (string & {}))[],
): PickSecondLevel<T, K> {
  return Object.keys(obj).reduce(
    (o, key) => {
      const sub = obj[key];
      if (sub && typeof sub === 'object') {
        const omited = {} as Record<K, any>;
        Object.keys(sub).forEach(k => {
          if (keys.includes(k)) return;
          omited[k as K] = sub[k];
        });
        (o as any)[key] = omited;
      } else {
        (o as any)[key] = sub;
      }
      return o;
    },
    {} as PickSecondLevel<T, K>,
  );
}
