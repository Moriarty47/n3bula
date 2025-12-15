import { createServer } from 'node:net';

type Options = {
  host?: string;
  timeout?: number;
  maxPort?: number;
};

export default function findFreePort(port: number, options: Options = {}) {
  const { maxPort = port + 10, timeout = 1000, host } = options;

  return new Promise<number>((resolve, reject) => {
    const tryPort = () => {
      if (port > maxPort) return reject(new Error('Try somw available port'));

      const server = createServer()
        .once('error', err => {
          server.close?.();
          const code = (err as any).code;
          if (code === 'EADDRINUSE' || code === 'EACCES') {
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
