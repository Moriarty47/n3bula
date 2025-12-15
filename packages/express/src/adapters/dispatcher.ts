import { Msg } from '$util/msg';
import type { Response } from 'express';

let status = {
  SUCCESS: 200,
  FAIL: 400,
  FILE_FILTER: 400,
  UPLOAD_FAIL: 400,
  MISSING_KEYS: 400,
  TOKEN: 401,
  CREDENTIALS: 401,
  FORBIDDEN: 403,
  NOT_FOUND_DATA: 404,
  NOT_FOUND_FILE: 404,
} as const;

type IsStringLiteral<T> = T extends string ? (string extends T ? false : true) : false;

export type StatusKey<T extends string = string & {}> =
  | keyof typeof status
  | (IsStringLiteral<T> extends true ? T | (string & {}) : T);

type StatusExtendFunc = (res: Response, message?: any) => Response<any, Record<string, any>>;

export type StatusExtend = {
  [key: string]: number | StatusExtendFunc;
};

type PickString<T extends any> = T extends string ? T : never;

export type Status<T extends StatusExtend = StatusExtend> = {
  [K in PickString<StatusKey>]: number | StatusExtendFunc;
} & {
  [K in keyof T]: T[K] extends number ? T[K] : T[K] extends StatusExtendFunc ? StatusExtendFunc : never;
};

export const getDispatchStatus = () => status;

export function extendDispatchStatus<T extends StatusExtend>(patch: Partial<Status<T>>) {
  status = {
    ...status,
    ...patch,
  };
  return dispatchStatus<T>;
}

export function dispatchStatus<T, Type = T extends StatusExtend ? keyof Status<T> : StatusKey>(
  res: Response,
  type?: Type,
  message?: any,
) {
  const handler = (status[(type ?? '') as keyof typeof status] ?? null) as StatusExtendFunc | number | null;
  if (typeof handler === 'function') return handler(res, message);
  if (typeof handler === 'number') return res.status(handler).json(message);
  return res.status(500).json(type || message || Msg.FAIL());
}
