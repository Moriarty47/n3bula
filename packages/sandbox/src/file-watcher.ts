import EventEmitter from 'node:events';
import { existsSync, readFileSync, stat, watch } from 'node:fs';
import { join } from 'node:path';

import { buildSync, transformSync } from 'esbuild';

import { logger } from './logger';

import type { FSWatcher, Stats } from 'node:fs';
import type { TsconfigRaw } from 'esbuild';

type TsOptions = { tsconfig: string } | { tsconfigRaw: TsconfigRaw };

const DEBOUNCE_MS = 200;
const READ_RETRY_MS = 100;
const MAX_READ_RETRIES = 5;
const DEFAULT_TSCONFIG = {
  compilerOptions: {
    strict: false,
    target: 'ES2022',
  },
};

function findTsconfigFromProcessRoot() {
  const tsconfigPath = join(process.cwd(), 'tsconfig.json');
  if (existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
      return tsconfig as TsconfigRaw;
    } catch {
      return;
    }
  }
  return;
}

export class FileWatcher extends EventEmitter {
  timer: NodeJS.Timeout | null = null;
  lastStat: Stats | null = null;
  readRetries = 0;
  watcher!: FSWatcher;
  tsOptions!: TsOptions;
  constructor(
    public filePath: string,
    public tsconfig?: string | TsconfigRaw,
  ) {
    super();
    this.normalizeTsOptions();
    this.scheduleRead = this.scheduleRead.bind(this);
    this.startWatch();
  }

  normalizeTsOptions() {
    const tsconfig = findTsconfigFromProcessRoot();
    if (tsconfig) {
      this.tsOptions = { tsconfigRaw: tsconfig };
      return;
    }
    if (typeof this.tsconfig === 'string') {
      try {
        this.tsOptions = { tsconfigRaw: JSON.parse(this.tsconfig) };
      } catch {
        this.tsOptions = { tsconfig: this.tsconfig };
      }
    } else {
      this.tsOptions = { tsconfigRaw: DEFAULT_TSCONFIG };
    }
  }

  safeReadAndNotify() {
    stat(this.filePath, (err, fileStat) => {
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
      if (
        this.lastStat
        && fileStat.mtimeMs === this.lastStat.mtimeMs
        && fileStat.size === this.lastStat.size
      )
        return;
      this.lastStat = fileStat;

      const data = buildSync({
        charset: 'utf8',
        entryPoints: [this.filePath],
        format: 'esm',
        legalComments: 'none',
        minify: true,
        minifyIdentifiers: false,
        minifySyntax: false,
        platform: 'node',
        write: false,
        ...this.tsOptions,
      }).outputFiles[0].contents;
      this.emit('change', transformSync(data, {
        
      }).code);
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
      const watcher = watch(
        this.filePath,
        { encoding: 'utf8', persistent: true },
        this.scheduleRead,
      );

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
