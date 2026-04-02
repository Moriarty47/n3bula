import { randomUUID } from 'node:crypto';
import vm from 'node:vm';

import { FileWatcher } from './file-watcher';
import { logger } from './logger';
import { _require, sandboxRequireCleanup } from './require';

import type { TsconfigRaw } from 'esbuild';

function createContext(sandboxGlobals = {}) {
  const context = vm.createContext({
    _require,
    clearInterval,
    clearTimeout,
    console,
    fetch: typeof fetch !== 'undefined' ? fetch : undefined,
    setInterval,
    setTimeout,
    ...sandboxGlobals,
  });
  return context;
}

export type SandboxOptions = {
  name?: string;
  tsconfig?: string | TsconfigRaw;
};

export function createSandbox(
  watchFilePath: string,
  globals = {},
  options: SandboxOptions = {},
) {
  const sandboxContext = createContext({
    ...globals,
    __sandbox_name: options.name || randomUUID(),
  });

  function runCode(code: string) {
    return new Promise<any>((resolve, reject) => {
      try {
        const script = new vm.Script(`(async () => { ${code} })()`);
        const result: Promise<any> = script.runInContext(sandboxContext, {
          timeout: 2000,
        });
        resolve(result);
        sandboxRequireCleanup();
      } catch (error) {
        reject(error);
      }
    })
      .then(res => res)
      .catch(err => {
        logger.error(err);
      });
  }

  const watcher = new FileWatcher(watchFilePath, options.tsconfig);
  watcher.on('change', code => {
    runCode(code);
  });

  const destroy = () => {
    watcher.destroy();
    process.exit();
  };
  process.on('SIGINT', destroy);
  process.on('SIGTERM', destroy);
}
