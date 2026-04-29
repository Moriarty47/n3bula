import { isError } from '@/util/errors';

import type { MessagesFail, MessagesOk } from './types';

export type { StatusFail, StatusOk } from './types';
export type { MessagesFail, MessagesOk };

export type MsgResult = {
  code: number;
  msg: string;
  type: string;
  data?: any;
};
export type MsgResultProxy = {
  (payload?: Record<string, any>): MsgResult;
  (message?: string): MsgResult;
  (message?: string | Record<string, any>): MsgResult;
};
export type MsgTemplateFn =
  | ((payload?: any) => Omit<MsgResult, 'code'>)
  | string;
export type MsgTemplates = Record<string, MsgTemplateFn>;

const formatPayload = (payload: any) => {
  if (isError(payload)) return `[${payload.name}] ${payload.message}`;
  return payload;
};

const defaultMsgFormatter = (
  code: number,
  type: string,
  msg: string,
  payload?: any,
): MsgResult => ({
  code,
  msg: String(msg ?? ''),
  type,
  ...(payload !== undefined ? { data: formatPayload(payload) } : {}),
});

export {
  createMessageProxy as createMessage,
  defaultMsgFormatter as msgFormatter,
};

function createMessageProxy<T extends MsgTemplates>(
  code: number,
  messages: T,
  msgFormatter = defaultMsgFormatter,
) {
  messages = { ...messages };

  function targetFn(payload?: Record<string, any>): MsgResult;
  function targetFn(message?: string): MsgResult;
  function targetFn(message?: string | Record<string, any>): MsgResult {
    if (typeof message === 'string')
      return msgFormatter(code, 'default', message);

    const defaultMsg = (messages as any).default as MsgTemplateFn;
    const msg = typeof defaultMsg === 'string' ? defaultMsg : defaultMsg().msg;
    if (!message) return msgFormatter(code, 'default', msg);

    return msgFormatter(code, 'default', msg, message);
  }

  const handler: ProxyHandler<MsgResultProxy> = {
    get(target, prop, receiver) {
      if (typeof prop !== 'string') return Reflect.get(target, prop, receiver);
      if (prop === 'register') {
        return (newMessages: MsgTemplates) => {
          messages = {
            ...messages,
            ...newMessages,
          };
        };
      }
      if (!Object.prototype.hasOwnProperty.call(messages, prop))
        return Reflect.get(target, prop, receiver);

      const fn = messages[prop];
      if (typeof fn === 'string') {
        return (payload?: any) => msgFormatter(code, prop, fn, payload);
      }
      return (payload?: any) => ({
        code,
        ...(fn(payload) || {}),
      });
    },
  };

  return new Proxy(targetFn, handler) as MsgResultProxy & {
    register: (newMessages: MsgTemplates) => void;
  } & {
    [K in keyof T]: (payload?: any) => MsgResult;
  };
}

type MsgType = {
  OK: ReturnType<typeof createMessageProxy<Record<MessagesOk, MsgTemplateFn>>>;
  FAIL: ReturnType<
    typeof createMessageProxy<Record<MessagesFail, MsgTemplateFn>>
  >;
};

export const Msg = {} as MsgType;

export const initMsg = async (lang: 'zh' | 'en') => {
  if (lang !== 'zh' && lang !== 'en') lang = 'en';

  const { Fail, Ok } = (await import(`./i18n/${lang}.js`)) as {
    Fail: Record<MessagesFail, string>;
    Ok: Record<MessagesOk, string>;
  };
  Msg.OK = createMessageProxy(0, Ok) as unknown as MsgType['OK'];
  Msg.FAIL = createMessageProxy(1, Fail) as unknown as MsgType['FAIL'];
};
