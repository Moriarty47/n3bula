import { capitalize, getType, isArray, isBigInt, isBoolean, isFunction, isNull, isNumber, isPrimary, isString, isSymbol, padEnd, padStart, simpleMerge, type UnionWithException } from '@n3bula/utils';

const IS_CSS_LOADED: symbol = Symbol('is_CSS_Loaded');

const DOM_CACHE: Map<string, HTMLElement> = new Map();

/** @public */
export const loadCSS = () => {
  if (window && (window as any)[IS_CSS_LOADED]) return;
  const style = document.createElement('style');
  import('./json.css').then(value => {
    style.textContent = value.default as unknown as string;
    document.head.appendChild(style);
    Object.defineProperty(window, IS_CSS_LOADED, {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  });
};

const render = (domID: string | HTMLElement, content: string) => {
  let dom: HTMLElement | null;
  if (typeof domID === 'string') {
    dom = DOM_CACHE.get(domID) || document.getElementById(domID);
    DOM_CACHE.set(domID, dom!);
  } else {
    dom = domID;
  }
  if (dom) {
    const pre = document.createElement('pre');
    pre.classList.add('json-container');
    pre.innerHTML = content;
    dom.appendChild(pre);
  }
};

/** @public */
export const toHTML = (content: unknown, options: Omit<Partial<PrettyJSONOptions>, 'output'> = {}) => {
  const result = prettyJSONFormatter(content, {
    ...options,
    output: 'html',
  });
  return {
    value: result,
    render(domID: string | HTMLElement) {
      render(domID, result);
    }
  };
};

/** @public */
export const toText = (content: unknown, options: Omit<Partial<PrettyJSONOptions>, 'output'> = {}) => {
  const result = prettyJSONFormatter(content, {
    ...options,
    output: 'text',
  });
  return {
    value: result,
    render(domID: string | HTMLElement) {
      render(domID, result);
    }
  };
};

/** @public */
export type PrettyJSONOptions = {
  output: 'html' | 'text';
  indent: number;
  matrix: boolean;
  htmlMarks: ReturnType<typeof presetMarks>;
  quoteKeys: boolean;
  singleQuote: boolean;
  trailingComma: boolean;
};

const defaults: Omit<PrettyJSONOptions, 'htmlMarks'> = {
  output: 'html',
  indent: 2,
  matrix: false,
  quoteKeys: false,
  singleQuote: false,
  trailingComma: true,
};

/** @public */
export const prettyJSONFormatter = (content: unknown, options: Partial<Omit<PrettyJSONOptions, 'htmlMarks'>> = {}): string => {
  const config = simpleMerge<PrettyJSONOptions>(defaults as PrettyJSONOptions, options);
  config.htmlMarks = presetMarks(config);
  if (config.matrix) {
    if (isMatrix(content)) {
      return matrixFormatter(content, config);
    } else {
      throw new TypeError('Input should be a matrix.');
    }
  }
  return mainFormatter(content, config);
};

loadCSS();

export default prettyJSONFormatter;

type MarkType = UnionWithException<[
  'string',
  'number',
  'boolean',
  'symbol',
  'bigInt',
  'null',
  'undefined',
  'array',
  'object',
  'date',
  'regexp',
  'function',
  'mark',
]>;

const presetMarks = (options: PrettyJSONOptions) => {
  const isHTML = options.output === 'html';

  const typeMark = (value: string | number | boolean, type: MarkType) =>
    isHTML
      ? `<span class="json-${type}">${value}</span>`
      : `${value}`;

  const QUOTE = options.singleQuote
    ? typeMark('\'', 'mark')
    : typeMark('"', 'mark');

  const LT = isHTML ? '&lt;' : '<';
  const GT = isHTML ? '&gt;' : '>';

  const STRING = (value: string) => typeMark(`${QUOTE}${value}${QUOTE}`, 'string');
  const OBJECTKEY = options.quoteKeys
    ? STRING
    : (value: string) => typeMark(`${value}`, 'string');

  return {
    typeMark,
    TAB: '\t',
    QUOTE,
    SPACE: isHTML ? '&nbsp;' : ' ',
    LINEBREAK: '\n',
    SEMI: typeMark(': ', 'mark'),
    ARROW: typeMark(' => ', 'mark'),
    COMMA: typeMark(',', 'mark'),
    ARRAYLT: typeMark('[', 'array'),
    ARRAYRT: typeMark(']', 'array'),
    OBJECTLT: typeMark('{', 'object'),
    OBJECTRT: typeMark('}', 'object'),
    NULL: typeMark('null', 'null'),
    UNDEFINED: typeMark('undefined', 'undefined'),
    CIRCULAR_ERROR: typeMark(`${LT}Circular structure detected!${GT}`, 'error'),
    DATE: (value: Date) => typeMark(value.toString(), 'mark'),
    ERROR: (value: string) => typeMark(value, 'error'),
    ITALIC: (value: string) => typeMark(value, 'italic'),
    STRING,
    NUMBER: (value: number) => typeMark(`${value}`, 'number'),
    SYMBOL: (value: symbol) => typeMark(value.toString(), 'symbol'),
    BIGINT: (value: bigint) => typeMark(`${value.toString()}n`, 'bigint'),
    BOOLEAN: (value: boolean) => typeMark(value ? 'true' : 'false', 'boolean'),
    FUNCTION: (value: string) => typeMark(value, 'function'),
    OBJECTKEY,
  };
};

function isPrimaryObject(input: unknown): input is string | number | boolean {
  return ['string', 'number', 'boolean'].includes(getType(input));
}

function isMatrix(arr: unknown): arr is any[][] {
  if (!isArray(arr)) return false;
  const colLen = arr[0].length;
  return !arr.some(ar => !isArray(ar) || ar.length !== colLen);
}

function findMatrixMaxLength(matrix: any[][]): number {
  const rowLen = matrix.length;
  const colLen = matrix[0].length;
  let maxLength = 0;
  for (let i = 0; i < rowLen; i += 1) {
    const row = matrix[i];
    for (let j = 0; j < colLen; j += 1) {
      const ele = `${row[j]}`;
      if (ele.length > maxLength) {
        maxLength = ele.length;
      }
    }
  }
  return maxLength;
}

function matrixFormatter(input: any[][], options: PrettyJSONOptions): string {
  const { htmlMarks, indent, output } = options;
  const rowLen = input.length;
  let str = '';

  if (output === 'text') {
    const space = ' ';
    const gap = space.repeat(2);
    const colLen = input[0].length;
    const rowIdxLength = `${rowLen}`.length;
    const maxLength = findMatrixMaxLength(input);

    str = `${padStart(space, rowIdxLength, space)}${gap}${Array.from({ length: colLen }, (_, i) => padEnd('' + i, maxLength, space)).join(gap)
      }${gap}${htmlMarks.LINEBREAK}`;

    for (let i = 0; i < rowLen; i += 1) {
      str += `${padStart('' + i, rowIdxLength, space)}${gap}${input[i].map(item => padEnd('' + item, maxLength, space)).join(gap)}${gap}${htmlMarks.LINEBREAK}`;
    }
  } else {
    str = `${htmlMarks.ARRAYLT}${htmlMarks.LINEBREAK}`;

    const convert = (item: string | number): string => {
      if (typeof item === 'string') {
        return htmlMarks.STRING(item);
      }
      return htmlMarks.NUMBER(item);
    };

    for (let i = 0; i < rowLen; i += 1) {
      str += `${htmlMarks.SPACE.repeat(indent)}${htmlMarks.ARRAYLT} ${input[i].map(convert).join(', ')} ${htmlMarks.ARRAYRT}${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
    }

    str += `${htmlMarks.ARRAYRT}${htmlMarks.LINEBREAK}`;
  }

  return str;
}

function mainFormatter(input: unknown, options: PrettyJSONOptions, level: number = 1, cacheMap = new WeakMap()): string {
  const { htmlMarks } = options;
  if (isPrimary(input)) {
    return primaryFormatter(input, options);
  }
  if (isFunction(input)) {
    return functionFormatter(input, options);
  }
  if (isPrimaryObject(input)) {
    return primaryObjectFormatter(input, options);
  }
  const type = getType(input);
  if (type === 'date') {
    return htmlMarks.DATE(input as Date);
  }
  if (type === 'error') {
    return errorFormatter(input as Error, options);
  }
  if (type === 'object') {
    return objectFormatter(input as {}, options, level, cacheMap);
  }
  if (type === 'array') {
    return arrayFormatter(input as any[], options, level, cacheMap);
  }
  if (type === 'map') {
    return mapFormatter(input as Map<any, any>, options, level, cacheMap);
  }
  return '';
}

function mapFormatter(
  input: Map<any, any>,
  options: PrettyJSONOptions,
  level: number,
  cacheMap: WeakMap<object, any>,
): string {
  const { htmlMarks, indent } = options;
  if (cacheMap.has(input)) {
    return htmlMarks.CIRCULAR_ERROR;
  }
  cacheMap.set(input, true);
  let str = `${htmlMarks.ITALIC('Map(' + input.size + ')')} ${htmlMarks.OBJECTLT}${htmlMarks.LINEBREAK}`;

  const entries = input.entries();

  let entry;
  while (entry = entries.next()) {
    if (entry.value) {
      const key = entry.value[0];
      const val = entry.value[1];
      str += `${htmlMarks.SPACE.repeat(indent * level)}${mainFormatter(key, options, level + 1, cacheMap)}${htmlMarks.ARROW}${mainFormatter(val, options, level + 1, cacheMap)}`;
    }

    if (entry.done) {
      break;
    } else {
      str += `${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
    }
  }

  str += `${htmlMarks.SPACE.repeat(indent * (level - 1))}${htmlMarks.OBJECTRT}`;
  return str;
}

function arrayFormatter(
  input: any[],
  options: PrettyJSONOptions,
  level: number,
  cacheMap: WeakMap<object, any>,
): string {
  const { htmlMarks, indent } = options;
  if (cacheMap.has(input)) {
    return htmlMarks.CIRCULAR_ERROR;
  }
  cacheMap.set(input, true);
  let str = `${htmlMarks.ARRAYLT}${htmlMarks.LINEBREAK}`;

  for (let i = 0, len = input.length; i < len; i += 1) {
    str += `${htmlMarks.SPACE.repeat(indent * level)}${mainFormatter(input[i], options, level + 1, cacheMap)}`;
    if (i < len - 1) {
      str += `${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
    } else {
      str += `${options.trailingComma ? htmlMarks.COMMA : ''}${htmlMarks.LINEBREAK}`;
    }
  }

  str += `${htmlMarks.SPACE.repeat(indent * (level - 1))}${htmlMarks.ARRAYRT}`;
  return str;
}

function objectFormatter(
  input: { [key: string | symbol]: any; },
  options: PrettyJSONOptions,
  level: number,
  cacheMap: WeakMap<object, any>,
): string {
  const keys = Reflect.ownKeys(input);
  const { htmlMarks, indent } = options;
  if (cacheMap.has(input)) {
    return htmlMarks.CIRCULAR_ERROR;
  }
  cacheMap.set(input, true);
  let str = `${htmlMarks.OBJECTLT}${htmlMarks.LINEBREAK}`;

  for (let i = 0, len = keys.length; i < len; i += 1) {
    const key = typeof keys[i] === 'string'
      ? htmlMarks.OBJECTKEY(keys[i] as string)
      : htmlMarks.SYMBOL(keys[i] as symbol);
    str += `${htmlMarks.SPACE.repeat(indent * level)}${key}${htmlMarks.SEMI}${mainFormatter(input[keys[i]], options, level + 1, cacheMap)}`;
    if (i < len - 1) {
      str += `${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
    } else {
      str += `${options.trailingComma ? htmlMarks.COMMA : ''}${htmlMarks.LINEBREAK}`;
    }
  }
  str += `${htmlMarks.SPACE.repeat(indent * (level - 1))}${htmlMarks.OBJECTRT}`;
  return str;
}

function errorFormatter(input: Error, options: PrettyJSONOptions): string {
  const { htmlMarks } = options;
  return input.stack
    ? input.stack.replace(new RegExp(`(${input.name}): (${input.message})`), (_, $1, $2) => `${htmlMarks.ERROR($1)}${htmlMarks.SEMI}${$2}`)
    : `${htmlMarks.ERROR(input.name)}${htmlMarks.SEMI}${input.message}`;
}

function primaryObjectFormatter(input: string | number | boolean, options: PrettyJSONOptions): string {
  const { htmlMarks } = options;
  const type = getType(input);
  const template = (t: string, val: string) => `${htmlMarks.ITALIC(capitalize(t))} ${htmlMarks.OBJECTLT} ${val} ${htmlMarks.OBJECTRT}`;
  if (type === 'number') {
    return template(type, htmlMarks.NUMBER(input as number));
  } else if (type === 'string') {
    return template(type, htmlMarks.STRING(input as string));
  } else if (type === 'boolean') {
    return template(type, htmlMarks.BOOLEAN(input as boolean));
  }
  return '';
}

function functionFormatter(input: () => void, options: PrettyJSONOptions): string {
  const { htmlMarks } = options;
  const funcStr = htmlMarks.typeMark(htmlMarks.ITALIC('ƒ '), 'function-identifier')
    + input.toString()
      .replace(/^(function )(\w+)\(/g, ($0, $1, $2) => `${$1}${htmlMarks.typeMark($2, 'function-name')}(`)
      .replace(/^function /, '')
      .replace(/(^function|=>)/, $0 => htmlMarks.typeMark($0, 'function-identifier'));
  return options.htmlMarks.FUNCTION(funcStr);
}

function primaryFormatter(input: unknown, options: PrettyJSONOptions): string {
  const { htmlMarks } = options;
  if (isString(input)) {
    return htmlMarks.STRING(input);
  } else if (isNumber(input)) {
    return htmlMarks.NUMBER(input);
  } else if (isBoolean(input)) {
    return htmlMarks.BOOLEAN(input);
  } else if (isBigInt(input)) {
    return htmlMarks.BIGINT(input);
  } else if (isSymbol(input)) {
    return htmlMarks.SYMBOL(input);
  } else if (isNull(input)) {
    return htmlMarks.NULL;
  }
  return htmlMarks.UNDEFINED;
}
