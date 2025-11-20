import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { isAbsolute, join, resolve } from 'node:path';

import type { _RequiredNovaOptions, NovaOptions, RequiredNovaOptions } from './nova.ts';

const NOVA = '@n3bula/nova';
const PLACEHOLADER = NOVA.replace(/./g, ' ');

export const cwd = process.cwd();

export const logger = {
  info: (...msgs: any[]) => console.log(`\x1b[34m${NOVA}\x1b[m`, ...msgs),
  info2: (...msgs: any[]) => console.log(PLACEHOLADER, ...msgs),
  success: (...msgs: any[]) => console.log(`\x1b[32m${NOVA}\x1b[m`, ...msgs),
  warn: (...msgs: any[]) => console.log(`\x1b[33m${NOVA}\x1b[m`, ...msgs),
  error: (...msgs: any[]) => {
    const key = msgs[0];
    if (typeof key === 'object' && key.code && key.message) {
      console.log(`\x1b[31m${NOVA} ${key.code}\x1b[m`, key.message);
      return;
    }
    console.log(`\x1b[31m${NOVA}\x1b[m`, ...msgs);
  },
};

const isRelative = (p: string) => {
  if (typeof p !== 'string' || p === '') return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(p)) return false;
  if (p === '.' || p === '..' || p.startsWith('./') || p.startsWith('../')) return true;
  if (isAbsolute(p)) return false;
  return true;
};

const defaultWatchPath = join(cwd, 'src');

const getInput = (input?: string) => {
  if (!input) {
    input = ['ts', 'js'].map(ext => resolve(cwd, `src/index.${ext}`)).find(p => existsSync(p));
    if (!input) {
      throw new Error(`Missing entry file [${resolve(cwd, 'src/index')}.ts/js]`);
    }
    return input;
  }
  if (isRelative(input)) {
    return resolve(cwd, input);
  }
  return input;
};

export const mergeDefaultNovaConfig = (cfg: NovaOptions['nova'] = {}): _RequiredNovaOptions => ({
  watchPaths: defaultWatchPath,
  silent: false,
  timeout: 500,
  ...cfg,
  input: getInput(cfg.input),
});

export const novaConfigPath = (() => {
  const configPaths = ['ts', 'mjs', 'cjs', 'js'].map(ext => resolve(cwd, `nova.config.${ext}`));
  const _configPath = configPaths.find(cfg => existsSync(cfg));
  return _configPath;
})();

export async function getConfig() {
  const config: RequiredNovaOptions = novaConfigPath ? (await import(pathToFileURL(novaConfigPath).href)).default : {};

  config.nova = mergeDefaultNovaConfig(config.nova);

  return config;
}
