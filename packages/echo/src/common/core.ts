import { isNumber, isObject, isString, isSymbol } from '@n3bula/utils';

import {
  ASCII_END,
  ASCII_START,
  AsciiRgb,
  AsciiStyle,
  ECHO_TAG,
  ENABLE_TRACE,
  isNode,
  SPACE,
  SPACE_KEY,
} from '../common/constants';
import {
  errorLog,
  GLOBAL_CONFIGS,
  getBase64Image,
  getRGB,
  isAsciiStyleKey,
  isColorProp,
  isCSSProp,
  isEchoMethod,
  isStyleMethod,
  printStackLine,
  stringifyCSS,
  toArray,
  toNumber,
  truthy,
} from '../common/utils';

import type { TStyle } from '../browser/types';
import type { AnyFunc, EchoMethodType, StyleMethodType } from '../common/types';

function transformStyle(item: any, payload: Payload, index: number) {
  const style = (Object.keys(payload) as (keyof Payload)[])
    .reduce((ss, cmd, i) => {
      const v = payload[cmd][index];
      if (isString(v)) {
        ss[i] ||= '';
        if (isColorProp(cmd)) {
          ss[i] += `${AsciiRgb[cmd]};${getRGB(v).join(';')}`;
        } else if (isCSSProp(cmd)) {
          const arrV = toArray(v);
          ss[i] += arrV
            .map(c => (isAsciiStyleKey(c) ? AsciiStyle[c] : ''))
            .filter(truthy)
            .join(';');
        }
      }

      return ss;
    }, [] as string[])
    .filter(truthy)
    .join(';');

  return style ? `${ASCII_START}${style}m${item}${ASCII_END}` : item;
}

function transformBrowserStyle({
  args,
  payload = {} as Payload,
}: TransformConfig) {
  const finalParams: any[] = [];
  let template = '';

  args.forEach((item, i) => {
    const styles: string[] = [];
    if (payload.fg?.[i]) styles.push(`color:${payload.fg[i]}`);
    if (payload.bg?.[i]) styles.push(`background-color:${payload.bg[i]}`);

    const customCss = payload.css?.[i];
    if (isObject(customCss)) {
      styles.push(stringifyCSS(customCss));
    }

    const styleStr = styles.join(';');

    const isSimple = typeof item !== 'object' || item === null;

    if (isSimple) {
      template += `%c${item}%c `;
      finalParams.push(styleStr, '');
    } else {
      if (template) {
        template += `%c%o%c `;
        finalParams.push(styleStr);
        finalParams.push(item, '');
      }
    }
  });

  return [template.trimEnd(), ...finalParams];
}

function transformConfig(config: TransformConfig) {
  if (isNode) {
    let i = 0;
    return config.args.map(item => {
      if (isString(item) || isNumber(item)) {
        return transformStyle(item, config.payload as Payload, i++);
      }
      return item;
    });
  }
  return transformBrowserStyle(config);
}

function transform(
  type: EchoMethodType,
  config: TransformConfig,
  print: boolean,
) {
  const result = transformConfig(config);
  if (print) {
    return console[type](...result);
  }
  return result.length === 1 ? result[0] : result;
}

async function processImage(css: Exclude<TStyle, null>) {
  const { url, ...s } = css;
  if (!url) return;
  try {
    const res = await getBase64Image(
      url,
      s.height ? toNumber(s.height) : undefined,
    );
    (Object.keys(res) as (keyof typeof res)[]).forEach(k => {
      (css as any)[k] = res[k];
    });
  } catch (error) {
    errorLog(error);
  }
}

function execute(
  type: EchoMethodType,
  config: TransformConfig,
  print: boolean,
) {
  const hasAsync = config.payload?.css.some(c => isObject(c) && c.url);
  if (hasAsync) {
    printStackLine();
    return (async () => {
      if (!config.payload?.css) return;
      const imagePromises = config.payload.css
        .filter(c => isObject(c) && c.url && !c.url.startsWith('data:image'))
        .map(c => {
          if (!c || isString(c)) return;
          if (c.url) return processImage(c);
        })
        .filter(truthy);

      await Promise.all(imagePromises);
      return transform(type, config, print);
    })();
  }

  printStackLine();
  return transform(type, config, print);
}

type TransformConfig = { args: any[]; payload?: Payload };
type Payload = {
  fg: string[];
  bg: string[];
  css: (string | TStyle)[];
};
type Paths = string[];
type Store = {
  type: EchoMethodType;
  cache: Map<string, () => void>;
};
function createColorStyler(
  store: Store,
  paths: Paths,
  payload: Payload,
  values: any[] = [],
  print: boolean,
): AnyFunc {
  const target = (...args: any[]) => {
    if (paths.length === 0) {
      return execute(store.type, { args, payload }, print);
    }
    const lastToken = paths.at(-1);
    if (isCSSProp(lastToken) && args.length) {
      if (payload.css.length) {
        // Css already has some props, then it's last invoke
        return createColorStyler(
          store,
          [],
          {
            ...payload,
            css: [...payload.css],
          },
          [...values, ...args],
          print,
        )(...[...values, ...args]);
      }
      // Css but no props yet, then invoke css object
      return createColorStyler(
        store,
        [],
        {
          ...payload,
          css: [...args],
        },
        [...values],
        print,
      );
    }
    if (isStyleMethod(lastToken)) {
      return createColorStyler(
        store,
        [],
        {
          ...payload,
          [lastToken]: [...payload[lastToken], ...args],
        },
        [...values],
        print,
      );
    }
  };

  return new Proxy(target, {
    get(_target, prop, receiver: AnyFunc) {
      if (isSymbol(prop)) return;
      if (isStyleMethod(prop)) {
        const styler = createColorStyler(
          store,
          [prop],
          {
            ...payload,
            [prop]: [...payload[prop]],
          },
          [...values],
          print,
        );
        paths.pop();
        return styler;
      }

      const lastToken = paths.at(-1);
      if (isStyleMethod(lastToken)) {
        if (!isCSSProp(lastToken)) paths.pop();

        return createColorStyler(
          store,
          [...paths],
          {
            ...payload,
            [lastToken]: [...payload[lastToken], prop],
          },
          [...values],
          print,
        );
      }

      return receiver;
    },
  });
}

function createEcho(type: EchoMethodType = 'log', print: boolean) {
  const store = {
    cache: new Map(),
    type,
  } as unknown as Store;

  const target = (...args: any[]) => {
    return execute(store.type, { args }, print);
  };

  return new Proxy(target, {
    get(_target, prop, _receiver) {
      if (isSymbol(prop)) return;
      if (!isStyleMethod(prop)) return;

      return createColorStyler(
        store,
        [prop],
        {
          bg: [],
          css: [],
          fg: [],
        },
        [],
        print,
      );
    },
  }) as unknown as AnyFunc & Record<StyleMethodType, AnyFunc>;
}

export function createEchoProxy(print: boolean) {
  const target = (...args: any[]) => {
    return execute('log', { args }, print);
  };

  return new Proxy(target, {
    get(_target, prop, _receiver) {
      // If directly called then default to log method
      if (isStyleMethod(prop)) return createEcho('log', print)[prop];
      if (isEchoMethod(prop)) return createEcho(prop, print);
      return Reflect.get(_target, prop, _receiver);
    },
  });
}

export function defineProperties(echo: any) {
  Object.defineProperties(echo, {
    [ENABLE_TRACE]: {
      configurable: false,
      enumerable: false,
      get() {
        return GLOBAL_CONFIGS[ENABLE_TRACE];
      },
      set(v: boolean) {
        GLOBAL_CONFIGS[ENABLE_TRACE] = v;
      },
    },
    __TAG: {
      configurable: false,
      enumerable: false,
      value: ECHO_TAG,
      writable: false,
    },
    [SPACE_KEY]: {
      configurable: false,
      enumerable: true,
      value(count: number = 0) {
        count = toNumber(count);
        if (!Number.isFinite(count)) count = 0;
        if (count > 2) count -= 2;
        return SPACE.repeat(count);
      },
      writable: false,
    },
  });
}
