import { spawn } from 'node:child_process';

import n3bulaWatcher from '@n3bula/watcher';

import { logger, mergeDefaultNovaConfig } from './util.ts';

import type { ChildProcess } from 'node:child_process';
import type { NovaOptions, Watcher } from './types.ts';

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
