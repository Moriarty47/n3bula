import { DBFile } from './file';
import { NOOP, getNow, isNumber } from '$util/index';
import { Interval } from '$util/timer';
import { logger } from '$util/logger';

export type MiniRedisOptions = {
  dbFile?: string;
  expireCheckInterval?: number;
  maxFileSize?: number;
};

export type Meta = {
  expireAt: number | null;
};

export const command = {
  SET: 'SET',
  GET: 'GET',
  DEL: 'DEL',
  EXPIRE: 'EXPIRE',
  KEYS: 'KEYS',
  QUIT: 'QUIT',
} as const;

export type Command = keyof typeof command;

export type Operation = {
  cmd: Command;
  key: string;
  value?: any;
  ttl?: number;
};

export class MiniRedis {
  private dbFile: DBFile;
  private data = new Map<string, string>();
  private meta = new Map<string, Meta>();
  closed = false;
  defaultExpireCheckInerval: number;
  private expireTimer: Interval | null = null;

  constructor(options: MiniRedisOptions = {}) {
    this.dbFile = new DBFile({ filePath: options.dbFile, maxFileSize: options.maxFileSize });
    this.defaultExpireCheckInerval = options.expireCheckInterval || 10 * 1e3;
    this.startExpireTimer();

    this.loadFromDBFile();
  }

  private loadFromDBFile() {
    return this.dbFile.loadAllDataByLines(line => {
      let obj;
      try {
        obj = JSON.parse(line);
      } catch (err) {
        logger.error('loadAllDataByLines', err);
        return;
      }
      this.applyOpFromDBFile(obj, false);
    });
  }

  private applyOpFromDBFile(op: Operation, writeToFile = true) {
    const now = getNow();
    const { cmd, key, value, ttl } = op;
    switch (cmd) {
      case 'SET': {
        this.data.set(key, value);
        this.meta.set(key, {
          expireAt: ttl && isNumber(ttl) ? now + ttl : null,
        });
        break;
      }
      case 'DEL': {
        this.data.delete(key);
        this.meta.delete(key);
        break;
      }
      case 'EXPIRE': {
        if (this.data.has(key)) {
          this.meta.set(key, {
            expireAt: ttl && isNumber(ttl) ? now + ttl : null,
          });
        }
        break;
      }
      default:
        break;
    }

    if (!writeToFile) return;
    const line = JSON.stringify(op) + '\n';
    this.dbFile.append(line).catch(err => {
      logger.error('DBFile append error', err);
    });
  }

  private isAlive(key: string) {
    const m = this.meta.get(key);
    if (!m) return true;
    if (m.expireAt === null) return true;
    if (getNow() > m.expireAt) {
      this.data.delete(key);
      this.meta.delete(key);
      const op: Operation = { cmd: command.DEL, key };
      this.dbFile.append(JSON.stringify(op) + '\n').catch(NOOP);
      return false;
    }
    return true;
  }

  private async maybeTriggerRewrite() {
    try {
      const size = await this.dbFile.getFileSize();
      if (size < this.dbFile.maxFileSize) return;

      const lines: string[] = [];
      for (const [k, v] of this.data.entries()) {
        if (!this.isAlive(k)) continue;
        const m = this.meta.get(k);
        const ttl = m && m.expireAt ? Math.max(0, m.expireAt - getNow()) : undefined;
        const op: Operation = { cmd: command.SET, key: k, value: v, ttl };
        lines.push(JSON.stringify(op));
      }
      await this.dbFile.rewrite(lines);
    } catch (err) {
      logger.error('Rewrite failed', err);
    }
  }

  private startExpireTimer() {
    this.expireTimer = new Interval(this.defaultExpireCheckInerval);
    this.expireTimer.set(() => {
      try {
        const now = getNow();
        const toRemove = [];
        for (const [k, m] of this.meta.entries()) {
          if (m && m.expireAt && now > m.expireAt) toRemove.push(k);
        }

        if (toRemove.length === 0) return;

        for (const k of toRemove) {
          this.data.delete(k);
          this.meta.delete(k);
          const op: Operation = { cmd: command.DEL, key: k };
          this.dbFile.append(JSON.stringify(op) + '\n').catch(NOOP);
        }
      } catch {}
    });
  }

  async set(key: string, value: any, ttl?: number) {
    const op: Operation = { cmd: command.SET, key, value, ttl: isNumber(ttl) ? ttl : undefined };
    this.applyOpFromDBFile(op, true);
    await this.maybeTriggerRewrite();
    return 'OK';
  }

  get(key: string) {
    if (!this.isAlive(key)) return Promise.resolve(null);
    return Promise.resolve(this.data.get(key) ?? null);
  }

  private isExists(key: string) {
    return this.data.has(key) && this.isAlive(key);
  }

  del(key: string) {
    const existed = this.isExists(key);
    if (existed) {
      const op: Operation = { cmd: command.DEL, key };
      this.applyOpFromDBFile(op, true);
    }
    return Promise.resolve(existed ? 1 : 0);
  }

  exists(key: string) {
    return Promise.resolve(this.isExists(key) ? 1 : 0);
  }

  keys(pattern: string = '*') {
    if (pattern === '*') {
      // matches all
      return Array.from(this.data.keys()).filter(k => this.isAlive(k));
    }
    if (pattern.endsWith('*')) {
      // matches prefix
      const prefix = pattern.slice(0, -1);
      return Array.from(this.data.keys()).filter(k => k.startsWith(prefix) && this.isAlive(k));
    }
    // exact match
    return this.isExists(pattern) ? [pattern] : [];
  }

  expire(key: string, ttl: number) {
    if (!this.isExists(key)) return Promise.resolve(0);
    const op: Operation = { cmd: command.EXPIRE, key, ttl };
    this.applyOpFromDBFile(op);
    return Promise.resolve(1);
  }

  async close() {
    if (this.closed) return;
    this.expireTimer?.clear();
    this.expireTimer = null;

    await this.dbFile.close();
    this.closed = true;
  }
}
