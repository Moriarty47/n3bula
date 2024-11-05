import { META } from './constants';


/**
 * Page Header
 * 0             20          24              127       128
 * +--------------+-----------+---------------+----------+
 * |   [buffer]   |   [int]   |               |   0xff   |
 * | magic_header | timestamp |  unused_space | end flag |
 * |   _string    |           |               |          |
 * +--------------+-----------+---------------+----------+
 * Page Item
 * 0            4       +value_size
 * +------------+---------+
 * |    [int]   |  [int]  |
 * | value_size |  value  |
 * +------------+---------+
 */
export class PageHeader {

  static create<T extends typeof PageHeader>(this: T): InstanceType<T> {
    const info = Buffer.alloc(META.FILE_HEADER_SIZE);
    META.MAGIC_HEADER.copy(info);
    const ctime = parseInt('' + (Date.now() / 1000));
    info.writeInt32BE(ctime, META.CREATE_TIME_OFFSET);
    info.writeInt8(0x0f, META.FILE_HEADER_END_OFFSET);
    return new this(info) as InstanceType<T>;
  }

  readonly buffer: Buffer; // 128 bytes

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  verify(): boolean {
    return this.buffer.subarray(0, META.MAGIC_HEADER.length).compare(META.MAGIC_HEADER) === 0;
  }
}

/**
 * Indexes Header
 * 0             20          24           28            32
 * +--------------+-----------+------------+------------+
 * |   [buffer]   |   [int]   |    [int]   |    [int]   |
 * | magic_header | timestamp | index_size | delete_num |
 * |   _string    |           |            |            |
 * +--------------+-----------+------------+------------+
 * 32            127       128
 * +--------------+----------+
 * |              |   0xff   |
 * | unused_space | end flag |
 * |              |          |
 * +--------------+----------+
 * 
 * Index
 * 0             1          5        9     +key_size
 * +-------------+----------+--------+-------+
 * |    [bit]    |   [int]  |  [int] | [int] |
 * | delete_flag | key_size | offset |  key  |
 * |0: not delete|          |        |       |
 * |1:  delete   |          |        |       |
 * +-------------+----------+--------+-------+
 */
export class IndexHeader extends PageHeader {

  static create<T extends typeof PageHeader>(this: T): InstanceType<T> {
    const info = Buffer.alloc(META.FILE_HEADER_SIZE);
    META.MAGIC_INDEX_HEADER.copy(info);
    const ctime = parseInt('' + (Date.now() / 1000));
    info.writeInt32BE(ctime, META.CREATE_TIME_OFFSET);
    info.writeInt32BE(0, META.INDEX_SIZE_OFFSET);
    info.writeInt32BE(0, META.DELETE_NUM_OFFSET);
    info.writeInt8(0x0f, META.FILE_HEADER_END_OFFSET);
    return new this(info) as InstanceType<T>;
  }

  /** The size of all indexes */
  get indexSize(): number {
    return this.buffer.readInt32BE(META.MAGIC_INDEX_HEADER_SIZE);
  }

  set indexSize(value: number) {
    this.buffer.writeInt32BE(value, META.MAGIC_INDEX_HEADER_SIZE);
  }

  /** The count of all deleted indexes */
  get deletedNum(): number {
    return this.buffer.readInt32BE(META.DELETE_NUM_OFFSET);
  }

  set deletedNum(value: number) {
    this.buffer.writeInt32BE(value, META.DELETE_NUM_OFFSET);
  }

  verify(): boolean {
    return this.buffer.subarray(0, META.MAGIC_INDEX_HEADER.length).compare(META.MAGIC_INDEX_HEADER) === 0;
  }
}

export type Header = typeof IndexHeader | typeof PageHeader;