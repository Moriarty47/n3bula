import fs from 'fs';
import path from 'node:path';
import { Pager } from './pager';
import { BTree } from './btree';
import { Cursor } from './cursor';
import { SimpleDBError, deserialize, serilaize2Buffer } from './utils';
import { DEFAULT_DB_NAME, } from './constants';
import type { SerializeType } from './types';


export class Database {
  private readonly pager: Pager;
  private fd: number | null;
  private btree: BTree | null = null;
  readonly root: string;
  readonly path: string;
  readonly name: string;


  constructor(options?: { name?: string; root?: string; }) {
    this.root = options?.root || path.resolve(__dirname, '../db');
    this.name = options?.name || DEFAULT_DB_NAME;
    this.path = path.resolve(this.root, this.name + '.db');
    if (!fs.existsSync(this.root)) {
      fs.mkdirSync(this.root, { recursive: true });
    }
    this.fd = fs.openSync(
      this.path,
      fs.existsSync(this.path) ? 'r+' : 'w+'
    );
    this.pager = new Pager(this.fd);
  }

  open(): this {
    if (!this.pager.verifyFileHeader()) {
      throw new SimpleDBError('Cannot open the db file. File maybe corrupted.');
    }
    this.btree = new BTree(this.pager, new Cursor(this.pager));
    return this;
  }

  close(): void {
    if (!this.fd) return;
    fs.closeSync(this.fd);
    this.fd = null;
    this.btree = null;

  }

  get(key: string): SerializeType | null {
    if (!this.btree) {
      throw new SimpleDBError('Database is not open yet. Try call `db.open` first.');
    }

    return deserialize(
      this.btree.find(Buffer.from(key))
    );
  }

  set(key: string, value: string): SerializeType | null {
    if (!this.btree) {
      throw new SimpleDBError('Database is not open yet. Try call `db.open` first.');
    }

    if (this.btree.find(Buffer.from(key))) {
      throw new SimpleDBError(`Key [${key}] already exists.`);
    }

    const buffer = serilaize2Buffer(value);

    this.btree.insert(Buffer.from(key), buffer);
    return deserialize(buffer);
  }

  update(key: string, value: string): SerializeType | null {
    if (!this.btree) {
      throw new SimpleDBError('Database is not open yet. Try call `db.open` first.');
    }

    const prevValue = this.btree.find(Buffer.from(key));
    if (prevValue === null) {
      throw new SimpleDBError(`Key [${key}] do not exists`);
    }

    const buffer = serilaize2Buffer(value);

    this.btree.insert(Buffer.from(key), buffer);
    this.btree.insert(Buffer.from(key), buffer);
    return deserialize(buffer);
  }
}

