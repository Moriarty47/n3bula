import { dispatchStatus } from './dispatcher';

import type { Response } from 'express';
import type { MessagesOk, MessagesFail } from '$util/msg';

export type ResponseBase = Response<any, Record<string, any>> | Promise<Response<any, Record<string, any>>>;

export type ResponseAdapterFunc = (res: Response, ...args: any[]) => ResponseBase;

export type ResponseAdapterExtend = { [key: string]: ResponseAdapterFunc };

export type ResponseOk = { code: 0; type: MessagesOk | (string & {}); [k: string]: any };

export type ResponseFail = { code: 1; type: MessagesFail | (string & {}); [k: string]: any };

export type ResponseAdapter<T extends ResponseAdapterExtend = ResponseAdapterExtend> = {
  success: (res: Response, payloads: ResponseOk) => ResponseBase;
  error: (res: Response, error: ResponseFail) => ResponseBase;
  send: (res: Response, status: number, data: any) => ResponseBase;
} & T;

let currentResponseAdapter: ResponseAdapter = {
  success(res, payloads) {
    return dispatchStatus(res, payloads);
  },
  error(res, error) {
    return dispatchStatus(res, error);
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
