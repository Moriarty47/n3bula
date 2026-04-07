export { default as express } from 'express';

export {
  dispatchStatus,
  extendDispatchStatus,
  getDispatchStatus,
} from '@/adapter/dispatcher';
export { extendResponseAdapter, getResponseAdapter } from '@/adapter/response';
export {
  Delete,
  Get,
  Head,
  Options,
  Patch,
  Post,
  Put,
  Route,
} from '@/deco/routing';

export {
  createMessageProxy as createMessage,
  defaultMsgFormatter as msgFormatter,
  initMsg,
  Msg,
} from '@/util/msg';

export { virtualApiResolver } from '../virtual-api-resolver';
export { createApp, startServer } from './app';

export type {
  ResponseAdapter,
  ResponseAdapterExtend,
  ResponseAdapterFunc,
  ResponseBase,
} from '@/adapter/response';
export type { HttpMethod } from '@/deco/routing';
export type { ApiDir, App, ExpNextFn, ExpRequest, ExpResponse } from '@/types';
export type {
  MessagesFail,
  MessagesOk,
  MsgResult,
  MsgResultProxy,
  MsgTemplateFn,
  MsgTemplates,
  StatusFail,
  StatusOk,
} from '@/util/msg';
