import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import timeout from '$mw/timeout';
import { isDev } from '$util/utils';
import { errorLogger, logger } from '$util/log';
import autoRegisterRoutes from '$mw/auto-register';

import type { Server } from 'node:http';
import type { App, AppConfig } from './types';

export async function createApp(appConfig: AppConfig = {} as AppConfig): Promise<App> {
  const app = express()
    .use(cookieParser())
    .use(compression())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(timeout)
    .disable('x-powered-by');

  const middlewares = appConfig.middlewares || {};

  Object.values(middlewares).forEach(mw => {
    app.use(mw as any);
  });

  await autoRegisterRoutes(app, appConfig);

  const originAppListen = app.listen;

  Object.defineProperty(app, 'listen', {
    value: (port: number) =>
      new Promise((resolve, reject) => {
        const server = originAppListen.call(app, port, error => {
          if (error) return reject(error);
          resolve(server);
        });
        addServerListener(port, server);
      }),
  });

  return app as unknown as App;
}

function addServerListener(port: number, server: Server) {
  server
    .on('dropRequest', req => {
      logger('dropRequest', req.url);
    })
    // .on('connection', _socket => {
    //   logger('connection');
    // })
    .on('close', () => {
      logger('Server is closed.');
    })
    .on('error', error => {
      if ((error as any).syscall !== 'listen') {
        throw error;
      }
      const isPipe = (portOrPipe: number) => Number.isNaN(portOrPipe);
      const bind = isPipe(port) ? `Pipe ${port}` : `Port ${port}`;
      switch ((error as any).code) {
        case 'EACCES':
          errorLogger(`${bind} requires elevated privileges.`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          errorLogger(`${bind} is already in use.`);
          break;
        default:
          throw error;
          break;
      }
    });

  const close = () => server.close();

  process.on('SIGINT', close);
  process.on('SIGTERM', close);

  return server;
}

export async function startServer() {
  const PORT = 3000;
  const app: App = await createApp();
  const server = await app.listen(PORT);
  logger(`Server is running on \x1B[92mhttp://localhost:${PORT}\x1B[m`);
  return server;
}

if (isDev) {
  startServer();
}
