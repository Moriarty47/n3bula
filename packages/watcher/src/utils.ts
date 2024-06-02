import fs from 'fs';
import lockResolver from './lock-resolver';
import type { INO_S, LockOptions } from './types';

export const getFileStats = (filePath: string) =>
  fs.statSync(filePath, { bigint: true });

let isStatsReliable: boolean | undefined;


export const getIno = (
  inos: INO_S,
  filePath: string,
  stats?: fs.Stats | fs.BigIntStats
): string | undefined => {
  if (Reflect.has(inos, filePath)) return inos[filePath];

  if (!stats && isStatsReliable !== false) {
    stats = fs.statSync(filePath, { bigint: true });
  }

  if (stats && typeof isStatsReliable !== 'boolean') {
    isStatsReliable =
      process.platform !== 'win32' || typeof stats.ino === 'bigint';
  }

  if (stats && stats.ino && isStatsReliable) {
    return (inos[filePath] = String(stats.ino));
  }

  return (inos[filePath] = undefined);
};


export const getLock = (
  id: string | undefined,
  timeout: number,
  options: LockOptions
): void => {
  if (!id) return options.handlers.free();

  const release = options.locks.read[id];

  if (release) {
    options.handlers.override(release());
    return;
  }

  const resolver = () => {
    Reflect.deleteProperty(options.locks.write, id);
    options.handlers.free();
  };

  lockResolver.add(resolver, timeout);

  options.locks.write[id] = () => {
    lockResolver.remove(resolver);
    Reflect.deleteProperty(options.locks.write, id);
    return options.handlers.overridden();
  };
};
