import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_DB_NAME, DEFAULT_DB_EXT } from './constants';
import { DBError, deserialize, logger, serilaize2Buffer } from '@/utils';
import { IndexFile, PageFile } from './file';

const cwd = process.cwd();

export type MapValue = {
  /** this offset means the pointer's offset in the index file  */
  offset: number;
  pointer: Buffer;
};

export type HashMap = Map<string, MapValue>;

export class Database {
  readonly root: string;
  readonly path: string;
  readonly idxPath: string;
  readonly name: string;
  private pageFile!: PageFile;
  private indexFile!: IndexFile;
  private hashMap: HashMap = new Map();
  public currentTable: string | null = null;

  constructor(name?: string, root?: string) {
    this.root = root || path.resolve(cwd, './db');
    this.name = name || DEFAULT_DB_NAME;
    this.path = path.resolve(this.root, `${this.name}.${DEFAULT_DB_EXT}`);
    this.idxPath = `${this.path}i`;
    if (!fs.existsSync(this.root)) {
      fs.mkdirSync(this.root, { recursive: true });
    }
  }

  open(): this {
    this.indexFile = new IndexFile(this.idxPath, this.hashMap);
    this.pageFile = new PageFile(this.path, this.hashMap);

    if (!this.verifyHeader()) {
      throw new DBError('Cannot open the db file. File maybe corrupted.');
    }
    logger('Db started.');

    this.indexFile.readIndexes();

    return this;
  }

  close(): void {
    this.indexFile.closeFile();
    this.pageFile.closeFile();
    logger('Db closed.');
  }

  verifyHeader(): boolean {
    return this.indexFile.verifyHeader() && this.pageFile.verifyHeader();
  }

  isSelectTable(): boolean {
    return !!this.currentTable;
  }

  createTable(tableName: string): void {
    if (this.isSelectTable()) {
      throw new DBError('Cannot create a new table while selecting an existing one.');
    }
    this.currentTable = tableName;
  }

  set(key: string, value: any): void {
    value = serilaize2Buffer(value);
    const pointer = this.pageFile.insertValue(value);
    this.indexFile.insertIndex(key, pointer);
  }

  del(key: string): void {
    this.indexFile.deleteIndex(key);
  }

  put(key: string, value: any): void {
    this.del(key);
    this.set(key, value);
  }

  get(key: string): any {
    const value = this.indexFile.readIndex(key);
    if (value === undefined) return null;
    const offset = value.pointer.readInt32BE(0);
    return deserialize(this.pageFile.readValue(offset));
  }
}
