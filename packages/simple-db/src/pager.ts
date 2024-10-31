import fs from 'fs';
import { FILE_HEADER_SIZE, PAGE_SIZE } from './constants';
import { FileHeader } from './fileheader';
import { SimpleDBError } from './utils';
import { BTreeNode } from './btreenode';

/**
 * FileHeader
 * 0             20          22         26          30             100
 * +--------------+-----------+----------+-----------+--------------+
 * |   [buffer]   |   [int]   |  [int]   |   [int]   |              |
 * | magic_header | page_size | max_page | root_page | unused_space |
 * |   _string    |           |   _id    |    _id    |              |
 * +--------------+-----------+----------+-----------+--------------+
 */
export class Pager {
  static getPageOffsetById(id: number): number {
    return (id - 1) * PAGE_SIZE + FILE_HEADER_SIZE;
  }

  private readonly fd: number;
  private header: FileHeader | null = null;

  constructor(fd: number) {
    this.fd = fd;
  }

  private saveHeaderToFile() {
    if (!this.header) return;

    fs.writeSync(this.fd, this.header.buffer, 0, FILE_HEADER_SIZE, 0);
  }

  allocNewPage(): [number, Buffer] {
    if (!this.header) {
      throw new SimpleDBError('File header not initialized.');
    }

    const buf = Buffer.alloc(PAGE_SIZE);
    const header = BTreeNode.createEmptyHeader();
    header.copy(buf);
    const id = this.header.maxPageId + 1;
    this.saveHeaderToFile();
    this.writePageById(id, buf);
    return [id, buf];
  }

  verifyFileHeader(): boolean {
    const isEmpty = fs.fstatSync(this.fd).size === 0;
    if (isEmpty) {
      this.header = FileHeader.create();
      this.saveHeaderToFile();
    } else {
      const header = Buffer.alloc(FILE_HEADER_SIZE);
      fs.readSync(this.fd, header, 0, FILE_HEADER_SIZE, 0);
      this.header = new FileHeader(header);
    }
    return this.header.verify();
  }

  setRootPage(id: number): void {
    this.header!.rootPageId = id;
    this.saveHeaderToFile();
  }

  readRootPage(): [number, Buffer | null] {
    if (!this.header) {
      throw new SimpleDBError('File headernot initialized.');
    }
    const id = this.header.rootPageId;
    if (id === 0) return [0, null];

    return [id, this.readPageById(id)];
  }

  readPageById(id: number): Buffer {
    const buf = Buffer.alloc(PAGE_SIZE);
    fs.readSync(this.fd, buf, 0, PAGE_SIZE, Pager.getPageOffsetById(id));
    return buf;
  }

  writePageById(id: number, buf: Buffer): void {
    fs.writeSync(this.fd, buf, 0, PAGE_SIZE, Pager.getPageOffsetById(id));
  }
}