import fs from 'fs';
import { info } from 'node:console';


export const isDev = import.meta.env.MODE === 'development';

export const DONE = 'Done.';

export const currentWorkingDirectory = process.cwd();

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
type COLOR_KEY = keyof typeof FG;

export const tagify = (
  message: string = '[DBJS]',
  fg: COLOR_KEY = 'white',
  bg: COLOR_KEY = 'magenta',
): string => `\x1b[${BG[bg]};${FG[fg]}m${message}\x1b[m`;

export class DBError extends Error {
  constructor(message: string) {
    super(tagify(message, 'red', 'reset'));
    this.name = 'DBError';
  }
}

export const NOOP = (..._: any): any => { };
export const NOOP_Promise = (..._: any): Promise<void> => Promise.resolve();

export const logger = (
  message: string = '[DBJS]',
  fg: COLOR_KEY = 'white',
  bg: COLOR_KEY = 'magenta',
) => {
  info(tagify(message, fg, bg));
};

export const assertIsDefined: <T>(value: T, msg?: string) => asserts value is NonNullable<T> = (value, msg = 'Something went wrong.') => {
  if (value === undefined || value === null) {
    throw new DBError(msg);
  }
};

export const mkdirIfNotExists = async (dirPath: fs.PathLike, options: fs.MakeDirectoryOptions = { recursive: true }): Promise<void> => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, options);
  }
};

export const mkfileIfNotExists = async (filePath: fs.PathLike, options: fs.WriteFileOptions = { encoding: 'utf-8' }): Promise<void> => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', options);
  }
};

export const rmSameDBFiles = async (dirPath: fs.PathLike): Promise<void> => {
  fs.rmSync(dirPath, { recursive: true, force: true });
};

/**
 * Find the index of the first element in the array that is greater than 
 * the target through binary search with a specified compare logic
 */
export function findIndexOfTheMaxElement<T, K>(
  array: T[],
  target: K,
  comparator: (current: T, target: K, currentIndex?: number, arr?: T[]) => number
): number {
  let low = 0;
  let high = array.length - 1;
  let i = -1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    const compare = comparator(array[mid], target, mid, array);

    if (compare <= 0) {
      // target is greater then move to right side
      low = mid + 1;
    } else {
      // move to left side
      i = mid;
      high = mid - 1;
    }
  }

  return i;
}

export const createInt32Buffer = (value: number): Buffer => {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32BE(value, 0);
  return buffer;
};


export const enum DataType {
  Boolean,
  Number,
  String,
  Object,
}

export type SerializeType = boolean | number | string | object;

export const serialize = (value: SerializeType): Buffer => {
  let type: Buffer;
  let data: Buffer;

  switch (typeof value) {
    case 'boolean': {
      type = Buffer.alloc(1, DataType.Boolean);
      data = Buffer.alloc(1, value ? 1 : 0);
      break;
    }
    case 'number': {
      type = Buffer.alloc(1, DataType.Number);
      data = Buffer.alloc(8);
      data.writeDoubleBE(value);
      break;
    }
    case 'string': {
      type = Buffer.alloc(1, DataType.String);
      data = Buffer.from(value);
      break;
    }
    default: {
      type = Buffer.alloc(1, DataType.Object);
      data = Buffer.from(JSON.stringify(value));
      break;
    }
  }

  data = Buffer.concat([type, data]);
  return data;
};

export const deserialize = (data: Buffer | null): SerializeType | null => {
  if (!data) return null;

  const type = data[0];
  switch (type) {
    case DataType.Boolean: return data[1] === 1;
    case DataType.Number: return data.readDoubleBE(1);
    case DataType.String: return data.subarray(1).toString();
    default: return JSON.parse(data.subarray(1).toString());
  }
};

export const serilaize2Buffer = (value: any): Buffer => {
  let buffer: Buffer;

  if (value === 'true' || value === 'false') {
    buffer = serialize(JSON.parse(value));
  } else if (/^-?\d+$/.test(value)) {
    buffer = serialize(parseFloat(value));
  } else {
    buffer = serialize(value);
  }
  return buffer;
};