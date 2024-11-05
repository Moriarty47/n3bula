import fs from 'node:fs';
import { Header, IndexHeader, PageHeader } from './header';
import { META } from './constants';
import type { HashMap, MapValue } from '.';

export class DBFile {
  protected readonly hashMap!: HashMap;
  readonly fd: number;
  header!: InstanceType<Header>;

  constructor(filePath: string, hashMap: HashMap) {
    this.fd = this.openFile(filePath);
    this.hashMap = hashMap;
  }

  private openFile(pt: string): number {
    return fs.openSync(pt, fs.existsSync(pt) ? 'r+' : 'w+');
  }

  closeFile(): void {
    fs.closeSync(this.fd);
  }

  saveHeaderToFile(): void {
    fs.writeSync(
      this.fd,
      this.header.buffer,
      0,
      META.FILE_HEADER_SIZE,
      0,
    );
  }

  verifyHeader<T extends Header>(HeaderCtor: T): boolean {
    const isEmpty = fs.fstatSync(this.fd).size === 0;
    if (isEmpty) {
      this.header = HeaderCtor.create() as InstanceType<T>;
      this.saveHeaderToFile();
    } else {
      const buffer = Buffer.alloc(META.FILE_HEADER_SIZE);
      fs.readSync(
        this.fd,
        buffer,
        0,
        META.FILE_HEADER_SIZE,
        0,
      );
      this.header = new HeaderCtor(buffer) as InstanceType<T>;
    }
    return this.header.verify();
  }
}

export class IndexFile extends DBFile {
  buffer!: Buffer;

  verifyHeader(): boolean {
    const isValid = super.verifyHeader(IndexHeader);

    if (isValid) {
      this.loadFileBuffer();
    }

    return isValid;
  }

  loadFileBuffer(): void {
    this.buffer = Buffer.alloc(fs.fstatSync(this.fd).size);
    fs.readSync(
      this.fd,
      this.buffer,
      0,
      this.buffer.length,
      META.FILE_HEADER_SIZE,
    );
  }

  readIndexes() {
    const buffer = this.buffer;
    const size = buffer.length - META.FILE_HEADER_SIZE;

    for (let offset = 0; offset < size;) {
      const isDeleted = buffer.readInt8(offset) === 1;
      const keySize = buffer.readInt32BE(offset + META.INDEX_DELETE_OFFSET);
      if (isDeleted) {
        offset = offset + META.INDEX_FIXED_SIZE + keySize;
        continue;
      }
      const keyOffset = offset + META.INDEX_FIXED_SIZE;
      const keyEndOffset = keyOffset + keySize;

      const pointerBuf = buffer.subarray(
        offset + META.INDEX_KEYSIZE_OFFSET,
        keyOffset,
      );
      const key = buffer.subarray(
        keyOffset,
        keyEndOffset
      );

      this.hashMap.set(key.toString(), { offset, pointer: pointerBuf });

      offset = keyEndOffset;
    }
  }

  readIndex(key: string): MapValue | undefined {
    return this.hashMap.get(key);
  }

  insertIndex(key: string, pointer: Buffer) {
    if (this.hashMap.has(key)) return;

    const keyBuf = Buffer.from(key);
    const buffer = Buffer.alloc(META.INDEX_FIXED_SIZE + keyBuf.length).fill(0);
    // write delete_flag and write key_size
    buffer.writeInt32BE(keyBuf.length, META.INDEX_DELETE_OFFSET);
    // write offset
    pointer.copy(buffer, META.INDEX_KEYSIZE_OFFSET, 0, pointer.length); // offset should be 4 bytes
    // write key
    keyBuf.copy(buffer, META.INDEX_FIXED_SIZE, 0, keyBuf.length);
    this.hashMap.set(key, { offset: this.buffer.length, pointer });
    this.saveToFile(this.buffer.length, buffer, () => {
      this.buffer = Buffer.concat([this.buffer, buffer]);
    });
  }

  deleteIndex(key: string): void {
    const value = this.hashMap.get(key);
    if (value === undefined) return;
    const { offset } = value;
    if (this.hashMap.delete(key)) {
      this.saveToFile(
        offset,
        Buffer.alloc(1).fill(1),
        () => {
          this.buffer.writeInt8(1, offset);
        }
      );
    }
  }

  updateIndex(key: string, newPointer: Buffer) {
    const value = this.hashMap.get(key);
    if (value === undefined) return;
    const { offset } = value;
    const offsetToFile = META.FILE_HEADER_SIZE + offset + META.INDEX_KEYSIZE_OFFSET;
    this.saveToFile(offsetToFile, newPointer, () => {
      newPointer.copy(this.buffer, offsetToFile, 0, newPointer.length);
    });
  }

  saveToFile(offset: number, buffer: Buffer, syncBuffer: () => void): void {
    fs.writeSync(
      this.fd,
      buffer,
      0,
      buffer.length,
      offset,
    );
    syncBuffer();
  }

}

export class PageFile extends DBFile {

  verifyHeader(): boolean {
    return super.verifyHeader(PageHeader);
  }

  insertValue(value: Buffer): Buffer {
    let buffer = Buffer.alloc(META.PAGE_VALUESIZE_SIZE);
    buffer.writeInt32BE(value.length, 0);
    buffer = Buffer.concat([buffer, value]);

    const offset = fs.fstatSync(this.fd).size;
    this.saveToFile(offset, buffer);

    const pointer = Buffer.alloc(4);
    pointer.writeInt32BE(offset, 0);
    return pointer;
  }

  readValue(offset: number): Buffer {
    const buffer = Buffer.alloc(META.PAGE_VALUESIZE_SIZE);
    fs.readSync(
      this.fd,
      buffer,
      0,
      buffer.length,
      offset,
    );
    const valueSize = buffer.readInt32BE(0);
    const valueBuf = Buffer.alloc(valueSize);
    fs.readSync(
      this.fd,
      valueBuf,
      0,
      valueSize,
      offset + META.PAGE_VALUESIZE_SIZE,
    );
    return valueBuf;
  }

  saveToFile(offset: number, buffer: Buffer): void {
    fs.writeSync(
      this.fd,
      buffer,
      0,
      buffer.length,
      offset
    );
  }
}