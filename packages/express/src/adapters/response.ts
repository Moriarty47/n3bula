import { dispatchStatus } from './dispatcher';

import type { Response } from 'express';
import type { StatusKey } from './dispatcher';

export type ResponseBase = Response<any, Record<string, any>> | Promise<Response<any, Record<string, any>>>;

export type ResponseAdapterFunc = (res: Response, ...args: any[]) => ResponseBase;

export type ResponseAdapterExtend = { [key: string]: ResponseAdapterFunc };

export type ResponseAdapter<T extends ResponseAdapterExtend = ResponseAdapterExtend> = {
  success: (res: Response, payloads?: { type?: 'SUCCESS'; [k: string]: any }) => ResponseBase;
  error: (res: Response, error?: { type?: Exclude<StatusKey, 'SUCCESS'>; [k: string]: any }) => ResponseBase;
  send: (res: Response, status: number, data: any) => ResponseBase;
} & T;

let currentResponseAdapter: ResponseAdapter = {
  success(res, payloads = {}) {
    const { type, ...message } = payloads;
    return dispatchStatus(res, type, message);
  },
  error(res, error = {}) {
    const { type, ...message } = error;
    return dispatchStatus(res, type, message);
  },
  send(res, status: number, data: any) {
    return res.status(status).send(data);
  },
};

export const getResponseAdapter = () => currentResponseAdapter;

export function extendResponseAdapter<T extends ResponseAdapterExtend>(
  patch: Partial<ResponseAdapter<T>> | ((prev: ResponseAdapter) => ResponseAdapter<T>),
) {
  if (typeof patch === 'function') {
    currentResponseAdapter = patch(currentResponseAdapter);
  } else {
    currentResponseAdapter = {
      ...currentResponseAdapter,
      ...patch,
    };
  }
  return currentResponseAdapter as ResponseAdapter<T>;
}
