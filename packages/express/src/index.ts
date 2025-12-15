export { createMsg, Msg } from '$util/msg';
export { createApp, startServer } from './app';

export { getDispatchStatus, extendDispatchStatus } from '$adapter/dispatcher';
export { getResponseAdapter, extendResponseAdapter } from '$adapter/response';

export { Route, Post, Delete, Put, Get, Patch, Head, Options } from '$deco/routing';

export { virtualApiResolver } from '../virtual-api-resolver';

export type { HttpMethod } from '$deco/routing';
export type { Status, StatusExtend, StatusKey } from '$adapter/dispatcher';
export type { ResponseBase, ResponseAdapter, ResponseAdapterFunc, ResponseAdapterExtend } from '$adapter/response';
export type { App, ApiDir, ExpRequest, ExpResponse, ExpNextFn } from '$types';
