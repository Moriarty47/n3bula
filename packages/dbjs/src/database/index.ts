import fs from 'node:fs';
import path from 'node:path';
import { IndexFile, PageFile, TableFile } from './file';
import { DEFAULT_DB_NAME, DEFAULT_DB_EXT, DEFAULT_DB_TABLE_EXT } from './constants';
import { DBError, currentWorkingDirectory, deserialize, logger, mkdirIfNotExists, rmSameDBFiles, serilaize2Buffer } from '@/utils';

export type MapValue = {
  /** this offset means the pointer's offset in the index file  */
  offset: number;
  pointer: Buffer;
};

export type HashMap = Map<string, MapValue>;

export class Database {
  static currentDatabase: string | null = null;

  readonly root: string;
  readonly path: string;
  readonly idxPath: string;
  readonly name: string;
  private pageFile!: PageFile;
  private indexFile!: IndexFile;
  private hashMap: HashMap = new Map();

  constructor(name?: string, root?: string) {
    this.name = name || DEFAULT_DB_NAME;
    this.root = root || path.resolve(currentWorkingDirectory, `./db/${this.name}`);
    this.path = path.resolve(this.root, `${this.name}.${DEFAULT_DB_EXT}`);
    this.idxPath = `${this.path}i`;

    mkdirIfNotExists(this.root);
  }

  async open(): Promise<string> {
    logger(
      fs.existsSync(this.path)
        ? `Database "${this.name}" already exists, connecting...`
        : `Creating database "${this.name}"...`,
      'white',
      'reset'
    );
    this.indexFile = new IndexFile(this.idxPath, this.hashMap);
    this.pageFile = new PageFile(this.path);
    if (!this.verifyHeader()) {
      throw new DBError('Cannot open the database file. File maybe corrupted.');
    }

    this.indexFile.readIndexes();

    return `Database "${this.name}" connected.`;
  }

  async close(): Promise<string> {
    this.indexFile?.closeFile();
    this.pageFile?.closeFile();
    return `Database "${this.name}" closed.`;
  }

  async __deleteDatabase(): Promise<void> {
    await this.close();
    await rmSameDBFiles(this.root);
  }

  verifyHeader(): boolean {
    return this.indexFile.verifyHeader() && this.pageFile.verifyHeader();
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

  createTable(tableName: string, columns: string[]): void {
    const tableFilePath = path.resolve(this.root, `${this.name}_${tableName}.${DEFAULT_DB_TABLE_EXT}`);
    const tableFile = new TableFile(tableFilePath);
    if (!tableFile.verifyHeader()) {
      throw new DBError('Cannot open the database file. File maybe corrupted.');
    }
    this.set(`N3BULA_TABLE__${tableName}`, tableFilePath);
  }

  getAllTables() {
    const keys = this.indexFile.searchKeys('N3BULA_TABLE__');
    console.log('keys :>>', keys);
  }
}
