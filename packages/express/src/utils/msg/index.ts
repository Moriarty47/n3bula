import type { MessagesOk } from './en/ok';
import type { MessagesFail } from './en/fail';

export type { StatusOk, StatusFail } from './status';

export type { MessagesOk, MessagesFail };

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
export type MsgTemplateFn = ((payload?: any) => Omit<MsgResult, 'code'>) | string;
export type MsgTemplates = Record<string, MsgTemplateFn>;

export const defaultMsgFormatter = (code: number, type: string, msg: string, payload?: any): MsgResult => ({
  code,
  type,
  msg: String(msg ?? ''),
  ...(payload !== undefined ? { data: payload } : {}),
});

export function createMessageProxy<T extends MsgTemplates>(
  code: number,
  messages: T,
  msgFormatter = defaultMsgFormatter,
) {
  messages = { ...messages };

  function targetFn(payload?: Record<string, any>): MsgResult;
  function targetFn(message?: string): MsgResult;
  function targetFn(message?: string | Record<string, any>): MsgResult {
    if (typeof message === 'string') return msgFormatter(code, 'default', message);

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
      if (!Object.prototype.hasOwnProperty.call(messages, prop)) return Reflect.get(target, prop, receiver);

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
  FAIL: ReturnType<typeof createMessageProxy<Record<MessagesFail, MsgTemplateFn>>>;
};

export const Msg = {} as MsgType;

export const initMsg = async (lang: 'zh' | 'en') => {
  if (lang !== 'zh' && lang !== 'en') lang = 'en';
  Msg.OK = createMessageProxy(0, (await import(`./${lang}/ok.js`)).Messages) as unknown as MsgType['OK'];
  Msg.FAIL = createMessageProxy(1, (await import(`./${lang}/fail.js`)).Messages) as unknown as MsgType['FAIL'];
};
