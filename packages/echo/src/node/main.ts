import {
  ASCII_END,
  ASCII_RGB,
  ASCII_START,
  ASCII_Style,
  ECHO_TAG,
} from '../common/constants';
import {
  debugLog,
  defineProperties,
  getRGB,
  isASCIIStyleKey,
  isColorProp,
  isCSSProp,
  isMethodProp,
  isNumber,
  isStaticProp,
  isString,
  printStackLine,
  Store,
  toStringResult,
  withArray,
} from '../common/utils';

import type { HEX_COLOR_KEYS } from '../common/constants';
import type { EchoMethod } from '../common/types';
import type { Echo, EchoFunc } from './types';

const wrapStyle = (store: Store, item: string | number, index: number) => {
  const style = store.cmds
    .reduce((ss, cmd, i) => {
      let v = store[cmd][index];
      if (v) {
        ss[i] ||= '';
        if (isColorProp(cmd)) {
          ss[i] +=
            `${ASCII_RGB[cmd]};${getRGB(v as HEX_COLOR_KEYS | string).join(';')}`;
        } else if (isCSSProp(cmd)) {
          v = withArray(v);
          const s = (v as string[])
            .map(c => (isASCIIStyleKey(c) ? ASCII_Style[c] : ''))
            .filter(i => !!i)
            .join(';');
          ss[i] += s;
        }
      }
      return ss;
    }, [] as string[])
    .filter(i => !!i)
    .join(';');
  return style ? `${ASCII_START}${style}m${item}${ASCII_END}` : item;
};

function transformColor(store: Store, argArray: any[]) {
  let index = 0;
  const result: any[] = argArray.map(item => {
    if (isString(item) || isNumber(item)) {
      return wrapStyle(store, item, index++);
    }
    return item;
  });

  store.clear();
  return result;
}

function createCSSProxy(store: Store, method: string, proxy: EchoFunc) {
  let accessCount = 0;
  store.addCmd(method);
  return new Proxy(() => {}, {
    apply(_target, _thisArg, argArray: string[][]) {
      if (!argArray.length)
        throw new TypeError(`${store.cmds.at(-1)} require arguments`);
      if (accessCount > 0) {
        return (...args: any[]) => (proxy as any)['#excute'](argArray);
      }
      store.addCSS(argArray as any);
      return proxy;
    },
    get(_target, prop, receiver) {
      if (isASCIIStyleKey(prop)) {
        accessCount++;
        store.addCSS(prop, 0);
        return receiver;
      }

      if (isColorProp(prop)) return Reflect.get(proxy, prop);
      if (isCSSProp(prop)) return;

      return proxy;
    },
  });
}

function createColorProxy(store: Store, method: string, proxy: EchoFunc) {
  store.addCmd(method);
  return new Proxy(() => {}, {
    apply(_target, _thisArg, argArray) {
      if (!argArray.length)
        throw new TypeError(`${store.cmds.at(-1)} require arguments`);

      store.addArgs(...argArray);
      return proxy;
    },
    get(_target, prop) {
      store.addArgs(prop);
      return proxy;
    },
  });
}

function createEcho(type: EchoMethod = 'log') {
  const store = new Store();
  let proxy: EchoFunc;

  const excute = (args: any[], output = true): any[] | string | undefined => {
    const result = transformColor(store, args);
    printStackLine();
    debugLog('EXCUTE', ...store.print(), args)();

    if (output)
      return (console[type as keyof Console] as any).call(console, ...result);

    return toStringResult(result);
  };

  const echoTag = () => ECHO_TAG;
  const toString = (...args: any[]) => excute(args, false);
  const conditions = new Map<string | symbol, any>([
    ['then', undefined],
    ['prototype', {}],
    [Symbol.toStringTag, ECHO_TAG],
    [Symbol.toPrimitive, echoTag],
    ['toString', toString],
    ['valueOf', toString],
    ['#excute', excute],
  ]);

  const handler: ProxyHandler<EchoFunc> = {
    apply(_target, _thisArg, args) {
      return excute(args);
    },
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
  };

  proxy = new Proxy((() => {}) as EchoFunc, handler);
  return proxy;
}

export const echo: Echo = createEcho() as Echo;

defineProperties(echo, createEcho);
