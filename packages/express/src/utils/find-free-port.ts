import { createServer } from 'node:net';

import { logger } from './log';

export function findFreePort(
  port: number,
  host?: string,
  options:
    | boolean
    | {
        timeout?: number;
        maxPort?: number;
      } = false,
) {
  let stopOnFirst = false;
  let maxPort: number;
  let timeout: number;
  if (typeof options === 'boolean') {
    stopOnFirst = !options;
    maxPort = port + 10;
    timeout = 1000;
  } else {
    maxPort = options.maxPort || port + 10;
    timeout = options.timeout || 1000;
  }

  return new Promise<number>((resolve, reject) => {
    const tryPort = () => {
      if (port > maxPort) return reject(new Error('Try somw available port'));

      const server = createServer()
        .once('error', err => {
          server.close?.();
          const code = (err as any).code;
          if (code === 'EADDRINUSE' || code === 'EACCES') {
            if (stopOnFirst) {
              logger.error(`port ${port} is unavailable, please try another`);
              process.exit(1);
            }

            port += 1;
            setImmediate(tryPort);
            return;
          }
          reject(err);
        })
        .once('listening', () => {
          server.close?.(() => resolve(port));
        });

      const timer = setTimeout(() => {
        server.close?.();
        port += 1;
        tryPort();
      }, timeout);

      const clear = () => timer && clearTimeout(timer);

      server.once('error', clear);
      server.once('listening', clear);

      server.listen(port, host);
    };

    tryPort();
  });
}
