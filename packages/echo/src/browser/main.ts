import { type CSS_PROP, CssProp, ECHO_TAG, EMPTY_SPACE, ENABLE_TRACE, SPACE, Style } from '../common/constants';
import {
  debugLog,
  isColorProp,
  isMethodProp,
  isCSSProp,
  printStackLine,
  isStyleKey,
  isTextDecoProp,
  isStaticProp,
  errorLog,
  defineProperties,
  isString,
  toNumber,
} from '../common/utils';
import { getBase64Image, Store, stringifyCSS } from './utils';

import type { Echo, EchoFunc } from './types';
import type { EchoMethod, MaybePromise } from '../common/types';

async function processImage(store: Store) {
  const { css } = store;
  try {
    for (let i = 0, len = css.length; i < len; i += 1) {
      const { url, ...s } = css[i] || {};
      if (url) {
        css[i] = {
          ...(await getBase64Image(url, s.height ? toNumber(s.height) : undefined)),
          ...s,
        };
      }
    }
  } catch (error) {
    errorLog(error);
  }
}

function processCSS(store: Store, args: any[]) {
  args.forEach((arg, i) => {
    if (!arg) return;
    store.addStyle(i, stringifyCSS(arg));
  });
}

function processColor(store: Store, cssProp: string, args: any[]) {
  args.forEach((arg, i) => {
    if (!arg) return;
    store.addStyle(i, `${cssProp}:${arg};`);
  });
}

function transformStyle(store: Store) {
  store.cmds.forEach(cmd => {
    const args = store[cmd];
    if (!args) return;
    if (isCSSProp(cmd)) return processCSS(store, args);

    const cssProp = CssProp[cmd as CSS_PROP];
    processColor(store, cssProp, args);
  });
}

function transformColor(store: Store, argArray: any[]) {
  const args: any[] = [];
  transformStyle(store);
  if (store.styles.length) {
    let index = 0;
    const templateString = argArray
      .map((item, i) => {
        if (isString(item)) {
          args.push(store.styles[index], SPACE);
          index++;
          return `%c${item}`;
        }
        args.push(argArray[i], SPACE);
        return '%o';
      })
      .join(EMPTY_SPACE);
    store.clear();
    return [templateString, ...args.slice(0, -1)];
  }
  store.clear();
  return argArray;
}

function transform(store: Store, argArray: any[], promisify: true): Promise<any[]>;
function transform(store: Store, argArray: any[], promisify?: boolean): any[];
function transform(store: Store, argArray: any[], promisify = false): MaybePromise<any[]> {
  if (promisify) {
    return processImage(store).then(() => transformColor(store, argArray));
  }
  return transformColor(store, argArray);
}

function createCSSProxy(store: Store, method: string, proxy: EchoFunc) {
  store.addCmd(method);
  return new Proxy(() => {}, {
    get(_target, prop, receiver) {
      if (isStyleKey(prop)) {
        if (isTextDecoProp(prop)) {
          store.addCSS('text-decoration', Style[prop]);
          return receiver;
        }
        const [key, value] = Style[prop].split(':');
        store.addCSS(key as any, value);
        return receiver;
      }
      if (isCSSProp(prop)) return;

      return Reflect.get(proxy, prop);
    },
    apply(_target, thisArg, argArray) {
      if (!argArray.length) return thisArg;
      store.addArgs(...argArray);
      return (...args: any[]) => (proxy as any)['#excute'](args);
    },
  });
}

function createColorProxy(store: Store, method: string, proxy: EchoFunc) {
  store.addCmd(method);
  return new Proxy(() => {}, {
    get(_target, prop) {
      store.addArgs(prop);
      return proxy;
    },
    apply(_target, _thisArg, argArray) {
      if (!argArray.length) throw new TypeError(`${store.cmds.at(-1)} require arguments`);

      store.addArgs(...argArray);
      return proxy;
    },
  });
}

function createEcho(type: EchoMethod = 'log') {
  const store = new Store();
  let proxy: EchoFunc;

  const excute = (args: any[]) => {
    if (store.promisify) {
      return (async () => {
        const result = await transform(store, args, true);
        (console[type as keyof Console] as any).call(console, ...result);
      })();
    }
    const result = transform(store, args);
    (console[type as keyof Console] as any).call(console, ...result);
  };

  const echoTag = () => ECHO_TAG;
  const conditions = new Map<string | symbol, any>([
    ['then', undefined],
    ['prototype', {}],
    [Symbol.toStringTag, ECHO_TAG],
    [Symbol.toPrimitive, echoTag],
    ['toString', echoTag],
    ['valueOf', echoTag],
    ['#excute', excute],
  ]);

  const handler: ProxyHandler<EchoFunc> = {
    get(target, prop, receiver) {
      if (conditions.has(prop)) return conditions.get(prop);
      if (isStaticProp(prop)) return Reflect.get(target, prop);

      debugLog('GET', type, prop)();
      prop = prop as string;

      if (isMethodProp(prop)) return Reflect.get(target, prop, receiver);
      if (isColorProp(prop)) return createColorProxy(store, prop, proxy);
      if (isCSSProp(prop)) return createCSSProxy(store, prop, proxy);

      return Reflect.get(target, prop);
    },
    apply(_target, _thisArg, args) {
      printStackLine(echo[ENABLE_TRACE]);

      debugLog('EXCUTE', ...store.print(), args)();

      return excute(args);
    },
  };

  proxy = new Proxy((() => {}) as EchoFunc, handler);
  return proxy;
}

export const echo: Echo = createEcho() as Echo;

defineProperties(echo, createEcho);

// echo[ENABLE_TRACE] = true;
