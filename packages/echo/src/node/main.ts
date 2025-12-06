import {
  ASCII_END,
  ASCII_RGB,
  ASCII_START,
  ASCII_Style,
  ECHO_TAG,
  ENABLE_TRACE,
  HEX_COLOR_KEYS,
  HEX_COLORS,
} from '../common/constants';
import {
  debugLog,
  defineProperties,
  getRGB,
  isColorProp,
  isCSSProp,
  isMethodProp,
  isStaticProp,
  isString,
  isASCIIStyleKey,
  printStackLine,
  Store,
  withArray,
  isNumber,
} from '../common/utils';

import type { EchoMethod } from '../common/types';
import type { Echo, EchoFunc } from './types';

const wrapStyle = (store: Store, item: string | number, index: number) => {
  const style = store.cmds
    .reduce((ss, cmd, i) => {
      let v = store[cmd][index];
      if (v) {
        ss[i] ||= '';
        if (isColorProp(cmd)) {
          ss[i] += `${ASCII_RGB[cmd]};${getRGB(v as HEX_COLOR_KEYS | string).join(';')}`;
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
  const result: any[] = argArray.map((item, i) => {
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
    apply(_target, _thisArg, argArray: string[][]) {
      if (!argArray.length) throw new TypeError(`${store.cmds.at(-1)} require arguments`);
      if (accessCount > 0) {
        return Reflect.apply(proxy, proxy, argArray);
      }
      store.addCSS(argArray as any);
      return proxy;
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
    const result = transformColor(store, args);
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
