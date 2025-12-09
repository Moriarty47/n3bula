import { spawn } from 'node:child_process';

import n3bulaWatcher from '@n3bula/watcher';

import { logger, mergeDefaultNovaConfig, useDotEnv } from './util';

import type { ChildProcess } from 'node:child_process';
import type { NovaOptions, Watcher } from './types';

let timer: NodeJS.Timeout | null = null;
let cp: ChildProcess | null = null;
let watcher: Watcher | null = null;

export async function novaDev(options: NovaOptions = {}, envPath: string, extraParams?: string[]) {
  const { processEnv } = useDotEnv(envPath, 'DEV');

  const { nova = {}, ...restOptions } = options;
  const { input, watchPaths, silent, timeout } = mergeDefaultNovaConfig(nova);

  await reload(input, processEnv, extraParams);

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
      timer = setTimeout(() => reload(input, processEnv, extraParams), timeout);
    },
  );

  watcher.on('ready', () => {
    !silent && logger.info('Listen files change...');
  });

  process.once('SIGINT', cleanup('SIGINT')).once('SIGTERM', cleanup('SIGTERM'));
}

const tsx = import.meta.resolve('tsx/esm');

async function reload(input: string, processEnv: any, extraParams?: string[]) {
  return new Promise((rsv, rej) => {
    const defaultArgs = ['--import', tsx, input];
    const args = extraParams && extraParams.length > 0 ? [...extraParams, ...defaultArgs] : defaultArgs;
    cp?.kill('SIGINT');
    cp = spawn('node', args, {
      stdio: 'inherit',
      env: processEnv,
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
