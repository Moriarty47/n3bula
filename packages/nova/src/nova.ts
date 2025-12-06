import { spawn } from 'node:child_process';

import n3bulaWatcher from '@n3bula/watcher';

import { logger, mergeDefaultNovaConfig } from './util.ts';

import type { RollupOptions } from 'rollup';
import type { ChildProcess } from 'node:child_process';

type WatcherCreator = typeof n3bulaWatcher;
type Watcher = ReturnType<WatcherCreator>;
type GetOptions<T> = T extends (paths: any, options: infer U, ...rest: any[]) => {} ? U : never;
type WatcherOptions = GetOptions<WatcherCreator>;
export type NovaOptions = {
  nova?: {
    watchPaths?: string | readonly string[];
    input?: string;
    outputFile?: string;
    outputDtsFile?: string;
    tsconfigPath?: string;
    silent?: boolean;
    timeout?: number;
  };
} & WatcherOptions &
  Omit<RollupOptions, 'input'>;
export type _RequiredNovaOptions = Exclude<Required<NovaOptions['nova']>, undefined>;
export type RequiredNovaOptions = NovaOptions & { nova: _RequiredNovaOptions };

let timer: NodeJS.Timeout | null = null;
let cp: ChildProcess | null = null;
let watcher: Watcher | null = null;

export async function defineNova(options: NovaOptions = {}) {
  const { nova = {}, ...restOptions } = options;
  const { input, watchPaths, silent, timeout } = mergeDefaultNovaConfig(nova);

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

const tsx = import.meta.resolve('tsx/esm');

async function reload(input: string) {
  return new Promise((rsv, rej) => {
    cp?.kill('SIGINT');
    cp = spawn('node', ['--import', tsx, input], {
      stdio: 'inherit',
    })
      .on('spawn', rsv)
      .on('error', rej);
  });
}

function cleanup(signal?: number | NodeJS.Signals) {
  return () => {
    cp?.kill(signal);
    cp = null;
    watcher?.close();
  };
}
