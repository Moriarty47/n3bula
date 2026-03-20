import { cwd } from 'node:process';
import { resolve } from 'node:path';
import { open, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';

import { logger } from '$util/logger';
import { assert, getNow, rename, useDefer } from '$util/index';

import type { FileHandle } from 'node:fs/promises';
import type { Deferred } from '$util/index';

export type DBFileOptions = {
  filePath?: string;
  encoding?: BufferEncoding;
  maxFileSize?: number;
};

export type WrittenData = {
  bytesWritten: number;
  buffer: Buffer<ArrayBuffer>;
};

export type PendingData = {
  data: any;
  resolve: (value: WrittenData) => void;
  reject: (reason?: any) => void;
};

export class DBFile {
  private filePath: string;
  private encoding: BufferEncoding;
  private queue: PendingData[] = [];
  private writing = false;
  private pendingWriteDone = useDefer<boolean>();
  private rewriting = false;
  private pendingFileHandler!: Deferred<FileHandle>;
  private fileHandle: FileHandle | null = null;
  maxFileSize: number;

  constructor(options: DBFileOptions = {}) {
    this.processQueue = this.processQueue.bind(this);
    this.filePath = options.filePath || resolve(cwd(), './db/data.mir');
    this.encoding = options.encoding || 'utf8';
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024;
    this.open();
  }

  private async getFileHandle() {
    return this.pendingFileHandler.promise;
  }

  async open() {
    this.pendingFileHandler = useDefer<FileHandle>();
    return open(this.filePath, 'a+').then(this.pendingFileHandler.resolve).catch(this.pendingFileHandler.reject);
  }

  append(data: any) {
    return new Promise<WrittenData>((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  private get isWriteDone() {
    return !this.writing && this.queue.length === 0;
  }

  private async processQueue() {
    if (this.writing) return;

    this.fileHandle = await this.getFileHandle();

    const item = this.queue.shift();
    if (!item) return;
    this.writing = true;
    const buffer = Buffer.from(item.data, this.encoding);
    this.fileHandle
      .write(buffer, 0, buffer.length, null)
      .then(value => {
        item.resolve(value);
      })
      .catch(err => {
        item.reject(err);
      })
      .finally(() => {
        this.writing = false;
        if (this.isWriteDone) {
          this.pendingWriteDone.resolve(true);
        }
        setImmediate(this.processQueue);
      });
  }

  async loadAllDataByLines(callback: (line: string) => void) {
    assert(callback && typeof callback === 'function', 'require callback function');

    this.fileHandle = await this.getFileHandle();

    const stream = this.fileHandle.createReadStream({ encoding: this.encoding, autoClose: false });
    let remain = '';

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('data', chunk => {
        remain += chunk;
        let idx;
        while ((idx = remain.indexOf('\n')) >= 0) {
          const line = remain.slice(0, idx);
          remain = remain.slice(idx + 1);
          if (line.trim()) {
            try {
              callback(line);
            } catch (err) {
              stream.close();
              return reject(err);
            }
          }
        }
      });

      stream.on('end', () => {
        if (remain.trim()) {
          try {
            callback(remain);
          } catch (err) {
            return reject(err);
          }
          resolve(true);
        }
      });
    });
  }

  private async writeToTempFile(tmpPath: string, snapshotLines: string[]) {
    // write to temp file
    return new Promise((resolve, reject) => {
      const wstream = createWriteStream(tmpPath, { encoding: this.encoding, flags: 'w' });
      wstream.on('error', reject);
      wstream.on('finish', resolve);
      let i = 0;

      const write = () => {
        while (i < snapshotLines.length) {
          if (!wstream.write(snapshotLines[i] + '\n')) {
            wstream.once('drain', write);
            return;
          }
          i++;
        }
        wstream.end();
      };
      write();
    });
  }

  private async swap(tmpPath: string, oldPath: string) {
    const [err1] = await rename(this.filePath, oldPath);
    if (err1) logger.error(err1);

    const [err2] = await rename(tmpPath, this.filePath);
    if (err2) {
      logger.error(err2);
      return [err2, null] as const;
    }
    // remove old file
    // await unlink(oldPath);

    return [null, true] as const;
  }

  async rewrite(snapshotLines: string[]) {
    if (this.rewriting) throw new Error('Rewriting...');
    this.rewriting = true;

    const tmpPath = `${this.filePath}.tmp`;

    await this.writeToTempFile(tmpPath, snapshotLines);

    await this.pendingWriteDone.promise;

    const oldPath = `${this.filePath}.${getNow()}.old`;

    await this.swap(tmpPath, oldPath);

    await this.close();

    await this.open();
    this.rewriting = false;
  }

  async getFileSize() {
    try {
      const fileStat = await stat(this.filePath);
      return fileStat.size;
    } catch (err: any) {
      if (err.code === 'ENOENT') return 0;
      logger.error(err);
      return 0;
    }
  }

  async close() {
    this.fileHandle = await this.getFileHandle();

    try {
      await this.fileHandle.close();
    } catch {}

    this.fileHandle = null;
  }
}
