import { FILE_HEADER_SIZE, MAGIC_HEADER, MAGIC_HEADER_SIZE, PAGE_SIZE } from './constants';

const MAX_PAGE_OFFSET = MAGIC_HEADER_SIZE + 2;
const ROOT_PAGE_OFFSET = MAX_PAGE_OFFSET + 4;
/**
 * FileHeader
 * 0             20          22         26          30
 * +--------------+-----------+----------+-----------+
 * |   [buffer]   |   [int]   |  [int]   |   [int]   |
 * | magic_header | page_size | max_page | root_page |
 * |   _string    |           |   _id    |    _id    |
 * +--------------+-----------+----------+-----------+
 * 30          34            127       128
 * +-----------+-------------+----------+
 * |   [int]   |             |   0xff   |
 * | timestamp | unused_space| end flag |
 * |           |             |          |
 * +-----------+-------------+----------+
 */
export class FileHeader {
  static create(): FileHeader {
    const header = Buffer.alloc(FILE_HEADER_SIZE);
    MAGIC_HEADER.copy(header); // magic_header_string 20 bytes
    header.writeInt16BE(PAGE_SIZE, MAGIC_HEADER_SIZE); // page_size 0x1000 2 bytes offset to 22
    header.writeInt32BE(0, MAX_PAGE_OFFSET); // max_page_id 4 bytes
    header.writeInt32BE(0, ROOT_PAGE_OFFSET); // root_page_id 4 bytes
    const ctime = parseInt('' + (Date.now() / 1000));
    header.writeInt32BE(ctime, 30);
    header.writeInt8(0x0f, 127);
    return new FileHeader(header);
  }

  readonly buffer: Buffer; // 100 bytes

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  get maxPageId(): number {
    const index = this.buffer.readInt32BE(MAX_PAGE_OFFSET);
    this.buffer.writeInt32BE(index + 1, MAX_PAGE_OFFSET);
    return index;
  }

  get rootPageId(): number {
    return this.buffer.readInt32BE(ROOT_PAGE_OFFSET);
  }

  set rootPageId(id: number) {
    this.buffer.writeInt32BE(id, ROOT_PAGE_OFFSET);
  }

  verify(): boolean {
    return this.buffer.subarray(0, MAGIC_HEADER_SIZE).compare(MAGIC_HEADER) === 0;
  }
}