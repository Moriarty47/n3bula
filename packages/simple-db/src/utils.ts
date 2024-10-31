import type { SerializeType } from './types';

export const enum DataType {
  Boolean,
  Number,
  String,
}

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
    case 'string':
    default: {
      type = Buffer.alloc(1, DataType.String);
      data = Buffer.from(value);
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
    case DataType.String:
    default:
      return data.subarray(1).toString();
  }
};

export const serilaize2Buffer = (value: string): Buffer => {
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

export class SimpleDBError extends Error {
  constructor(message: string) {
    super(`\x1b[43;30m[SimpleDB]\x1b[m ${message}`);
    this.name = 'SimpleDBError';
  }
}
