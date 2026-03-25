import EventEmitter from 'node:events';
import { FSWatcher, readFile, stat, Stats, watch } from 'node:fs';

import { logger } from './logger';

const DEBOUNCE_MS = 200;
const READ_RETRY_MS = 100;
const MAX_READ_RETRIES = 5;

export class FileWatcher extends EventEmitter {
  timer: NodeJS.Timeout | null = null;
  lastStat: Stats | null = null;
  readRetries = 0;
  watcher!: FSWatcher;
  constructor(public filePath: string) {
    super();
    this.scheduleRead = this.scheduleRead.bind(this);
    this.startWatch();
  }

  safeReadAndNotify() {
    readFile(this.filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT' && this.readRetries < MAX_READ_RETRIES) {
          this.readRetries++;
          setTimeout(this.safeReadAndNotify, READ_RETRY_MS);
          return;
        }
        logger.error('Read error:', err.code, err.message);
        return;
      }
      this.readRetries = 0;
      stat(this.filePath, (err2, fileStat) => {
        if (!err2) {
          if (this.lastStat && fileStat.mtimeMs === this.lastStat.mtimeMs && fileStat.size === this.lastStat.size)
            return;
          this.lastStat = fileStat;
        }
        this.emit(
          'change',
          data
            .split(/\r?\n/)
            .filter(l => !/^\s*\/\//.test(l))
            .map(l => l.trim())
            .join(' '),
        );
      });
    });
  }

  scheduleRead() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      this.safeReadAndNotify();
    }, DEBOUNCE_MS);
  }

  startWatch() {
    try {
      const watcher = watch(this.filePath, { encoding: 'utf8', persistent: true }, this.scheduleRead);

      watcher.on('error', err => {
        logger.error('fs.watch error', err);
        if (watcher) {
          try {
            watcher.close();
          } catch {}
        }
      });

      stat(this.filePath, (err, fileStat) => {
        if (!err) this.lastStat = fileStat;
      });

      logger('Watching', this.filePath);
      this.watcher = watcher;
    } catch (error: any) {
      logger.error('fs.watch error', error.message);
    }
  }

  destroy() {
    if (this.watcher && typeof this.watcher.close === 'function') {
      try {
        this.watcher.close();
      } catch {}
    }
  }
}
