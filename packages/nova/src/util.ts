import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { config as dotEnvConfig } from 'dotenv';

import type { DotenvParseOutput } from 'dotenv';
import type { _RequiredNovaOptions, NovaOptions, RequiredNovaOptions } from './types';

export const NOVA = '@n3bula/nova';
const PLACEHOLADER = NOVA.replace(/./g, ' ');

export const cwd = process.cwd();

export const cwdRelative = (path: string) => relative(cwd, path);
export const cwdResolve = (...paths: string[]) => resolve(cwd, ...paths);
export const cwdJoin = (...paths: string[]) => join(cwd, ...paths);

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

type DynamicImportReturnType<T extends ((...args: any[]) => any)[]> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<infer R> ? R : never;
};

export function dynamicImport<T extends ((...args: any[]) => any)[]>(
  ...modulesPromises: T
): Promise<DynamicImportReturnType<T>> {
  return Promise.all(modulesPromises.map(m => m())) as Promise<DynamicImportReturnType<T>>;
}

const isRelative = (p: string) => {
  if (typeof p !== 'string' || p === '') return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(p)) return false;
  if (p === '.' || p === '..' || p.startsWith('./') || p.startsWith('../')) return true;
  if (isAbsolute(p)) return false;
  return true;
};

const getInput = (input?: string) => {
  if (!input) {
    input = ['ts', 'js'].map(ext => cwdResolve(`src/index.${ext}`)).find(p => existsSync(p));
    if (!input) {
      throw new Error(`Missing entry file [${cwdResolve('src/index')}.ts/js]`);
    }
    return input;
  }
  if (isRelative(input)) {
    return cwdResolve(input);
  }
  return input;
};

export const mergeDefaultNovaConfig = (cfg: NovaOptions['nova'] = {}): _RequiredNovaOptions => {
  const {
    outputFile = 'dist/index.js',
    outputDtsFile = outputFile.replace(/(.*)\.(c|m)?js/, (_, $1) => `${$1}.d.ts`),
  } = cfg;
  return {
    watchPaths: cwdJoin('src'),
    silent: false,
    timeout: 500,
    minify: false,
    tsconfigPath: cwdJoin('./tsconfig.json'),
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
  const configPaths = ['ts', 'mjs', 'cjs', 'js'].map(ext => cwdResolve(`nova.config.${ext}`));
  const _configPath = configPaths.find(cfg => existsSync(cfg));
  return _configPath;
})();

export async function getConfig() {
  const config: RequiredNovaOptions = novaConfigPath ? (await import(pathToFileURL(novaConfigPath).href)).default : {};

  config.nova = mergeDefaultNovaConfig(config.nova);

  return config;
}

export function getEnvPath(envPath: string, isDevMode: boolean = false) {
  let envP = '';
  if (envPath) {
    envPath = cwdResolve(envPath);
    if (existsSync(envPath)) {
      envP = envPath;
    } else {
      logger.warn('File not exists', envPath);
    }
  }
  if (!envP) {
    const defaultEnvPath = cwdResolve(isDevMode ? '.env' : '.prod.env');
    if (existsSync(defaultEnvPath)) return defaultEnvPath;
  }
  return envP;
}

export function useDotEnv(envPath: string, mode: string = 'PROD') {
  let config: DotenvParseOutput = {};
  const processEnv = { ...process.env, NOVA_MODE: mode } as any;
  if (envPath) {
    const dotEnvOutput = dotEnvConfig({
      quiet: true,
      path: envPath,
      processEnv,
    });
    if (!dotEnvOutput.error && dotEnvOutput.parsed) {
      config = { ...dotEnvOutput.parsed, NOVA_MODE: mode };
    }
  }
  return { config, processEnv };
}
