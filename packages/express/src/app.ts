import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import timeout from '$mw/timeout';
import { logger } from '$util/log';
import { isDev } from '$util/utils';
import { initMsg } from '$util/msg/index';
import findFreePort from '$util/find-free-port';
import autoRegisterRoutes from '$mw/auto-register';
import { NOOP } from '$const';

import type { Server } from 'node:http';
import type { App, AppConfig, ListenCallback } from '$types';

export async function createApp(appConfig: AppConfig = {} as AppConfig): Promise<App> {
  await initMsg(appConfig.lang || 'en');
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
    value: async (port: number, callback: ListenCallback = NOOP) => {
      const PORT = await findFreePort(port);
      if (PORT !== port) {
        logger.warn(`port ${port} is unavailable, using port ${PORT}`);
      }
      return new Promise((resolve, reject) => {
        const server = originAppListen.call(app, PORT, error => {
          if (error) return reject(error);
          callback(PORT);
          resolve(server);
        });
        addServerListener(PORT, server);
      });
    },
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
          logger.error(`${bind} requires elevated privileges.`);
          process.exit(1);
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use.`);
          break;
        default:
          throw error;
      }
    });

  const close = () => server.close();

  process.on('SIGINT', close);
  process.on('SIGTERM', close);

  return server;
}

export async function startServer(port: number = 3000, appConfig: AppConfig = {} as AppConfig) {
  const app: App = await createApp(appConfig);
  const server = await app.listen(port, usedPort => {
    logger(`Server is running on \x1B[92mhttp://localhost:${usedPort}\x1B[m`);
  });
  return server;
}

if (isDev) {
  startServer();
}
