export const enum CellType {
  // store the pointer to other pages
  Pointer,
  // store the Key-Value pair
  KeyValue,
}

class Cell {
  readonly buffer: Buffer;
  readonly offset: number;

  constructor(rawBuffer: Buffer, offset: number) {
    this.buffer = rawBuffer;
    this.offset = offset;
  }

  get keySize(): number {
    return this.buffer.readInt32BE(0); // 4 bytes
  }

  get key(): Buffer {
    return this.buffer.subarray(8, 8 + this.keySize); // 4 bytes
  }

  get size(): number {
    return this.buffer.length;
  }
}

/**
 * PointerCell
 * 0          4         8     +key_size
 * +----------+---------+---------+
 * |  [int]   |  [int]  | [bytes] |
 * | key_size | page_id |   key   |
 * +----------+---------+---------+
 */
export class PointerCell extends Cell {
  static calcSize(keySize: number): number {
    return 8 + keySize;
  }

  static create(key: Buffer, childPageId: number, offset: number): PointerCell {
    const buf = Buffer.alloc(8);
    buf.writeInt32BE(key.length, 0);
    buf.writeInt32BE(childPageId, 4);
    return new PointerCell(
      Buffer.concat([buf, key], buf.length + key.length),
      offset,
    );
  }

  readonly type = CellType.Pointer;

  get childPageId(): number {
    return this.buffer.readInt32BE(4); // 4 bytes
  }
}

/**
 * KeyValueCell
 * 0          4            8     +key_size +value_size
 * +----------+------------+---------+---------+
 * |  [int]   |    [int]   | [bytes] | [bytes] |
 * | key_size | value_size |   key   |  value  |
 * +----------+------------+---------+---------+
 */
export class KeyValueCell extends Cell {
  static calcSize(keySize: number, valueSize: number): number {
    return 8 + keySize + valueSize;
  }

  static create(key: Buffer, value: Buffer, offset: number): KeyValueCell {
    const buf = Buffer.alloc(8);
    buf.writeInt32BE(key.length, 0);
    buf.writeInt32BE(value.length, 4);
    return new KeyValueCell(
      Buffer.concat([buf, key, value], buf.length + key.length + value.length),
      offset,
    );
  }

  readonly type = CellType.KeyValue;

  get valueSize(): number {
    return this.buffer.readInt32BE(4); // 4 bytes
  }

  get value(): Buffer {
    return this.buffer.subarray(
      8 + this.keySize,
      8 + this.keySize + this.valueSize,
    );
  }
}