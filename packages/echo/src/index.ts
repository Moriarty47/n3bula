import type { PropertiesHyphen } from 'csstype';

const Style = {
  reset: '0',
  bold: '1',
  lighter: '2',
  italic: '3',
  underline: '4',
  blink: '5',
  reverse: '7',
  hidden: '8',
  linethrough: '9',
  underline2: '21',
  resetFontWeight: '22',
  resetFontStyle: '23',
  removeUnderline: '24',
  removeLinethrough: '29',
  overline: '53',
  removeOverline: '55',
};
const FG = {
  black: '30',
  red: '31',
  green: '32',
  yellow: '33',
  blue: '34',
  magenta: '35',
  cyan: '36',
  white: '37',
  rgb: '38;2',
  reset: '39',
  gray: '90',
};
const BG = {
  black: '40',
  red: '41',
  green: '42',
  yellow: '43',
  blue: '44',
  magenta: '45',
  cyan: '46',
  white: '47',
  rgb: '48;2',
  reset: '49',
  gray: '100',
};

type COLOR_KEYS = Exclude<keyof typeof FG, 'rgb' | 'reset'>;

interface EchoFunc {
  (...args: any[]): void;
  /** value */
  v(value: string | number): IColorOptions & TargetSubFunc;
  /** print */
  p(value?: any): void;
}

type TargetSubFunc = Pick<EchoFunc, 'p' | 'v'>;

type ColorOption<OmitKey extends keyof IColorOptions> =
  Record<COLOR_KEYS, Pick<IColorOptions, OmitKey> & TargetSubFunc>;

interface IColorOption<OmitKey extends keyof IColorOptions> extends ColorOption<OmitKey> {
  /** hex color value */
  (value: string): Pick<IColorOptions, 'bg' | 'fg'> & Pick<EchoFunc, 'p' | 'v'>;
  /** rgb color value */
  (r: number, g: number, b: number): Pick<IColorOptions, 'bg' | 'fg'> & Pick<EchoFunc, 'p' | 'v'>;
}

type StyleOptions = {
  [key in Exclude<keyof typeof Style, 'reset'>]: Omit<IColorOptions, 's'> & Pick<EchoFunc, 'p' | 'v'> & StyleOptions;
};

type CssValue = string | PropertiesHyphen;

interface IColorOptions {
  /** background */
  bg: IColorOption<'fg'>;
  /** foreground */
  fg: IColorOption<'bg'>;
  /** style */
  s: StyleOptions;
  /** css */
  css(value: CssValue): Omit<IColorOptions, 'css'> & Pick<EchoFunc, 'p' | 'v'>;
  /** image */
  img(src: string, height?: number): Omit<IColorOptions, 'img'> & Pick<EchoFunc, 'p' | 'v'>;
}

function restriantColor(value: string | number) {
  value = Number.parseInt(value as string);
  return value > 0 ? Math.min(255, value) : Math.max(0, value);
};

function hexToRgb(color: string): [number, number, number] {
  const fullReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = color.replace(fullReg, (_, r, g, b) => `${r}${r}${g}${g}${b}${b}`);
  const values = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  if (!values) {
    throw new Error(`[N3bula-color-log]: Unsupported ${color} color.`);
  }
  return [
    Number.parseInt(values[1], 16),
    Number.parseInt(values[2], 16),
    Number.parseInt(values[3], 16),
  ];
};

function objectCssToStringCss(css: Record<string, any>) {
  return Object.entries(css).map(([k, v]) => `${k}:${v};`).join('');
}

export function createEcho(options: {
  type: EchoMethod;
  debug?: boolean;
}) {
  const {
    type,
    debug = import.meta.env.MODE === 'development'
  } = options || {};

  let str = '';
  let funcKey = '';
  const store: string[] = [];
  const cssParams: (string | { url: Promise<PropertiesHyphen>; })[] = [];

  const calc = () => {
    if (store.length > 1) {
      const [v, ...rest] = store;
      str += `\x1b[${rest.join(';')}m${v}`;
    } else {
      store[0] && (str += store[0]);
    }
    str += '\x1b[m';
    funcKey = '';
    store.length = 0;
  };

  const processValue = (receiver: any) => (value: string) => {
    calc();
    store.push(value);
    return receiver;
  };

  const setStore = (param: string, clear: boolean = true) => {
    if (param) store.push(param);
    if (clear) funcKey = '';
  };

  const processColor = (funcKey: string, cb: (val: Record<string, string>) => void) => {
    let colors: Record<string, string> | undefined;
    if (funcKey === 'fg') colors = FG;
    if (funcKey === 'bg') colors = BG;
    if (colors) cb(colors);
  };

  const processStyle = (prop: string, receiver: any) => {
    setStore(Style[prop as keyof typeof Style], false);
    return receiver;
  };

  const processCss = (receiver: any) => (arg: CssValue) => {
    let css: string | { url: Promise<PropertiesHyphen>; };
    if (typeof arg === 'string') {
      css = { url: getBase64Image(arg) };
    } else {
      css = objectCssToStringCss(arg);
    }
    store[0] = '%c' + store[0];
    cssParams.push(css);
    return receiver;
  };

  const processProp = (prop: string, receiver: any) => {
    if (funcKey === 's') {
      processStyle(prop, receiver);
    } else {
      processColor(funcKey, colors => setStore(colors[prop]));
    }
    return receiver;
  };

  const processRGB = (receiver: any) => (...args: string[] | number[]) => {
    if (args.length === 0) throw new TypeError('[N3bula-color-log]: requires at least one argument');
    let val: [number, number, number];
    if (typeof args[0] === 'string') {
      val = hexToRgb(args[0]);
    } else {
      val = args as [number, number, number];
    }
    processColor(funcKey, colors => setStore(`${colors.rgb};${val.map(restriantColor).join(';')}`));
    return receiver;
  };

  const processFunckey = (prop: string, receiver: any) => {
    funcKey = prop;
    return receiver;
  };

  const print = async (value?: any) => {
    calc();
    for (let i = 0; i < cssParams.length; i++) {
      const cssPromise = cssParams[i];
      if (typeof cssPromise === 'object') {
        cssParams[i] = objectCssToStringCss(await cssPromise.url);
      }
    }
    if (value) {
      debugLog(str, ...cssParams as string[], value);
      console[type](str, ...cssParams, value);
    } else {
      debugLog(str, ...cssParams as string[]);
      console[type](str, ...cssParams);
    }
    str = '';
    store.length = 0;
    cssParams.length = 0;
  };

  const funcKeys = ['bg', 'fg', 's'];

  const process = (_: EchoFunc, prop: string, receiver: any) => {
    if (prop === 'v') return processValue(receiver);

    if (store.length === 0) throw new TypeError('[N3bula-color-log]: Invoke v function first.');

    if (funcKeys.includes(prop)) return processFunckey(prop, receiver);

    if (prop === 'css' || prop === 'img') return processCss(receiver);

    if (prop !== 'p') return processProp(prop, receiver);

    return receiver;
  };

  const handler: ProxyHandler<EchoFunc> = {
    get(target, prop, receiver) {
      return process(target, prop as string, receiver);
    },
    apply(_, thisArg, argArray) {
      const arg = argArray[0];
      if (
        (typeof arg === 'object' && arg !== null) ||
        arg === undefined
      ) return print(arg);
      return processRGB(thisArg)(...argArray);
    },
  };

  return new Proxy((() => { }) as EchoFunc, handler);

  function debugLog(...args: string[]) {
    if (debug) {
      let strIdx = 0;
      let params: any[] = [];
      for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === 'string') {
          params[strIdx] = (`${(params[strIdx] || '')}${params[strIdx] ? ', ' : ''}${args[i]}`).replace(/\x1b/gi, '\\x1b');
        } else {
          strIdx++;
          params.push(args[i]);
        }
      }
      console.log('', ...params);
    }
  }
}

type EchoMethod = 'log' | 'info' | 'warn' | 'trace' | 'error';
type Echo = Record<EchoMethod, EchoFunc>;
export const echo = new Proxy({} as Echo, {
  get(_, prop) {
    if (['log', 'info', 'warn', 'trace', 'error'].includes(prop as string)) {
      return createEcho({ type: prop as EchoMethod });
    }
    throw new TypeError('[N3bula-color-log]: should use method');
  },
});



async function getBase64Image(url: string, height: number = 100): Promise<PropertiesHyphen> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.height = height || image.naturalHeight;
      canvas.width = height * image.naturalWidth / image.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL();
      resolve({
        'font-size': '1px',
        'padding': `${canvas.height}px ${canvas.width}px`,
        'background': `url(${dataUrl}) no-repeat`,
        'background-size': 'contain'
      });
    };
    image.onerror = reject;
    image.src = url;
  });
}