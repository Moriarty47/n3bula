import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { isAbsolute, join, resolve } from 'node:path';

import type { _RequiredNovaOptions, NovaOptions, RequiredNovaOptions } from './types.ts';

export const NOVA = '@n3bula/nova';
const PLACEHOLADER = NOVA.replace(/./g, ' ');

export const cwd = process.cwd();

const wrapTag = (color: number, extra?: string) => `\x1b[${color}m${NOVA}${extra ? ' ' + extra : ''}\x1b[m`;

export const logger = {
  info: (...msgs: any[]) => console.log(wrapTag(34), ...msgs),
  info2: (...msgs: any[]) => console.log(PLACEHOLADER, ...msgs),
  success: (...msgs: any[]) => console.log(wrapTag(32), ...msgs),
  warn: (...msgs: any[]) => console.log(wrapTag(33), ...msgs),
  error: (...msgs: any[]) => {
    const key = msgs[0];
    if (typeof key === 'object' && key.code && key.message) {
      console.log(wrapTag(31, key.code), key.message, key.stack);
      return;
    }
    console.log(wrapTag(31), ...msgs);
  },
};

const isRelative = (p: string) => {
  if (typeof p !== 'string' || p === '') return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(p)) return false;
  if (p === '.' || p === '..' || p.startsWith('./') || p.startsWith('../')) return true;
  if (isAbsolute(p)) return false;
  return true;
};

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

export const mergeDefaultNovaConfig = (cfg: NovaOptions['nova'] = {}): _RequiredNovaOptions => {
  const {
    outputFile = 'dist/index.js',
    outputDtsFile = outputFile.replace(/(.*)\.(c|m)?js/, (_, $1) => `${$1}.d.ts`),
  } = cfg;
  return {
    watchPaths: join(cwd, 'src'),
    silent: false,
    timeout: 500,
    minify: false,
    tsconfigPath: join(cwd, './tsconfig.json'),
    alias: {},
    cjs: {},
    dts: {},
    esbuild: {},
    externals: {},
    json: {},
    nodeResolve: {},
    replace: {},
    ...cfg,
    outputFile,
    outputDtsFile,
    input: getInput(cfg.input),
  };
};

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
