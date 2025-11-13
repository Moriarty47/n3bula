import { spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import n3bulaWatcher from '@n3bula/watcher';

import { logger } from './util.ts';

import type { RollupOptions } from 'rollup';
import type { ChildProcess } from 'node:child_process';

type WatcherCreator = typeof n3bulaWatcher;
type Watcher = ReturnType<WatcherCreator>;
type GetOptions<T> = T extends (paths: any, options: infer U, ...rest: any[]) => {} ? U : never;
type WatcherOptions = GetOptions<WatcherCreator>;
export type NovaOptions = {
  input?: string;
  watchPaths?: string | readonly string[];
  silent?: number;
  timeout?: number;
} & WatcherOptions &
  RollupOptions;

const cwd = process.cwd();
const defaultWatchPath = join(cwd, 'src');
const __dirname = dirname(fileURLToPath(import.meta.url));
const loaderPath = pathToFileURL(resolve(__dirname, 'loaders/index.js')).href;

let timer: NodeJS.Timeout | null = null;
let cp: ChildProcess | null = null;
let watcher: Watcher | null = null;

export async function defineNova(options: NovaOptions = {}) {
  const {
    input = 'src/index.ts',
    watchPaths = defaultWatchPath,
    silent = false,
    timeout = 500,
    ...restOptions
  } = options;
  await reload(input);

  watcher = n3bulaWatcher(
    watchPaths,
    {
      ignoreInitial: true,
      ignored: [],
      ...restOptions,
    },
    async (event, filePath) => {
      !silent && logger.info(`detect ${event} event: ${filePath}`);

      if (event !== 'change' && event !== 'rename') return;

      timer && clearTimeout(timer);
      timer = setTimeout(() => reload(input), timeout);
    },
  );

  watcher.on('ready', () => {
    !silent && logger.info('Listen files change...');
  });

  process.once('SIGINT', cleanup('SIGINT')).once('SIGTERM', cleanup('SIGTERM'));
}

async function reload(input: string) {
  return new Promise(resolve => {
    cp?.kill('SIGINT');
    cp = spawn('node', ['--import', loaderPath, input], {
      stdio: 'inherit',
    }).on('spawn', resolve);
  });
}

function cleanup(signal?: number | NodeJS.Signals) {
  return () => {
    cp?.kill(signal);
    cp = null;
    watcher?.close();
  };
}
