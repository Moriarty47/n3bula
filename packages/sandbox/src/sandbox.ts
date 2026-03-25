import vm from 'node:vm';

import { FileWatcher } from './file-watcher';
import { logger } from './logger';

function createContext(sandboxGlobals = {}) {
  const context = vm.createContext({
    console,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    fetch: typeof fetch !== 'undefined' ? fetch : undefined,
    ...sandboxGlobals,
  });
  return context;
}

export function createSandbox(name: string, watchFilePath: string, globals = {}) {
  const sandboxContext = createContext({
    ...globals,
    __sandbox_name: name,
  });

  function runCode(code: string) {
    const script = new vm.Script(`(async () => { ${code} })()`);
    const result: Promise<any> = script.runInContext(sandboxContext, { timeout: 2000 });
    return result
      .then(res => res)
      .catch(err => {
        logger.error(err.name, err.message);
      });
  }

  const watcher = new FileWatcher(watchFilePath);
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
