import chokidar from 'chokidar';
import { getFileStats, getIno, getLock } from './utils';
import type { INO_S, Lock, WatchEvent, WatcherHandlers } from './types';

const RENAME_TIMEOUT = 1000;

const watcher = (
  paths: string | readonly string[],
  options: chokidar.WatchOptions,
  handlers: WatcherHandlers = {} as WatcherHandlers
): chokidar.FSWatcher => {
  if (typeof handlers === 'function') {
    return watcher(paths, options, {
      add: handlers,
      addDir: handlers,
      change: handlers,
      rename: handlers,
      unlink: handlers,
      unlinkDir: handlers,
    });
  }

  let inos: INO_S = {};
  let isReady: boolean = false;
  let locksAdd: Lock = {};
  let locksUnlink: Lock = {};

  const emit = (...args: [event: WatchEvent, ...rest: any[]]) => {
    const event = args[0];
    const handler = handlers[event];
    if (!handler) return;
    handler.apply(undefined, args);
  };

  const ready = () => {
    isReady = true;
  };

  const change = (filePath: string) => {
    const stats = getFileStats(filePath);
    emit('change', filePath, stats);
  };

  const add = (type: 'add' | 'addDir', filePath: string) => {
    const stats = getFileStats(filePath);
    const ino = getIno(inos, filePath, stats);
    if (options.ignoreInitial && !isReady) return; // ignore initial, while still registering it

    getLock(ino, RENAME_TIMEOUT, {
      locks: { read: locksUnlink, write: locksAdd },
      handlers: {
        free: () => emit(type, filePath, stats),
        override: (prevPath) => {
          if (prevPath === filePath) {
            emit('change', filePath, stats);
            return;
          }
          emit('rename', prevPath, filePath, stats);
        },
        overridden: () => filePath,
      },
    });
  };

  const unlink = (type: 'unlink' | 'unlinkDir', filePath: string) => {
    const ino = getIno(inos, filePath);

    getLock(ino, RENAME_TIMEOUT, {
      locks: { read: locksAdd, write: locksUnlink },
      handlers: {
        free: () => emit(type, filePath),
        override: (newPath) => {
          if (filePath === newPath) {
            emit('change', filePath);
            return;
          }
          emit('rename', filePath, newPath, getFileStats(newPath));
        },
        overridden: () => filePath,
      },
    });
  };

  const _options: chokidar.WatchOptions = { ...options, ignoreInitial: false };

  const _watcher = chokidar
    .watch(paths, _options)
    .on('ready', ready)
    .on('add', (path) => add('add', path))
    .on('addDir', (path) => add('addDir', path))
    .on('change', change)
    .on('unlink', (path) => unlink('unlink', path))
    .on('unlinkDir', (path) => unlink('unlinkDir', path));

  const _close = _watcher.close;

  _watcher.close = () => {
    inos = {};
    locksAdd = {};
    locksUnlink = {};
    return _close.call(_watcher);
  };

  return _watcher;
};

export default watcher;