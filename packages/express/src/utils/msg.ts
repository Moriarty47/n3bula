import { EMPTY_OBJECT } from '$const';
import { DefaultMsg } from './default-msg';

export const STATUS_CODE = {
  FAIL: 0,
  SUCCESS: 1,
  NOT_FOUND: 2,
  LOCKED: 3,
} as const;

type KeyofStatusCode = keyof typeof STATUS_CODE;

type MSGMap = {
  [P in KeyofStatusCode]?: {
    [key: string]: string;
  } & {
    default?: string;
  };
};

type MSG<T extends MSGMap> = {
  readonly [P in keyof T]: T[P] extends Record<string, string>
    ? {
        readonly [K in keyof T[P]]: T[P][K] extends string
          ? <U extends Record<string, any>>(
              payload?: U,
              customMessage?: string | null,
            ) => {
              [key in keyof U]: U[key];
            } & {
              code: P extends KeyofStatusCode ? (typeof STATUS_CODE)[P] : never;
              msg: T[P][K];
            }
          : never;
      } & {
        /** Custom message */
        (payload?: any, customMessage?: string): Record<string, any>;
      }
    : never;
};

function createMsgFn(messages: MSGMap[KeyofStatusCode] | string, type: KeyofStatusCode) {
  return new Proxy(() => {}, {
    apply(_target, _thisArg, argArray) {
      const [payload, msg] = argArray;
      return {
        type,
        code: STATUS_CODE[type as KeyofStatusCode],
        msg: msg || (messages as MSGMap[KeyofStatusCode])?.default || messages,
        ...(payload ? { data: payload } : EMPTY_OBJECT),
      };
    },
    get(_target, key) {
      const value = messages?.[key as keyof MSGMap[KeyofStatusCode]];
      if (!value) {
        throw new Error(`Invalid key of message: "${String(key)}".`);
      }
      return createMsgFn(value, type);
    },
  });
}

export function createMsg<T extends MSGMap>(messageMap: T): MSG<T> {
  return new Proxy(
    {},
    {
      get(_target, type) {
        const currentMsgKeys = messageMap[type as keyof T];
        if (!currentMsgKeys) {
          throw new Error(`Invalid message type: "${String(type)}".`);
        }
        return createMsgFn(currentMsgKeys, type as KeyofStatusCode);
      },
    },
  ) as MSG<T>;
}

export const Msg = createMsg(DefaultMsg);
