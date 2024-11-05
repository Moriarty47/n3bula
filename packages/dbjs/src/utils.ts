import { log } from 'node:console';

export const isDev = import.meta.env.MODE === 'development';

export const tagify = (message: string = '[DBJS]', green = false): string => green ? `\x1b[42;37m${message}\x1b[m` : `\x1b[45;30m${message}\x1b[m`;

export class DBError extends Error {
  constructor(message: string) {
    super(tagify(message));
    this.name = 'DBError';
  }
}

export const NOOP = () => { };

export const logger = isDev ? (...message: any[]) => {
  if (message.length === 1) {
    log(tagify(), message[0]);
  } else {
    log(tagify(message[0], true), ...message.slice(1));
  }
} : NOOP;

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