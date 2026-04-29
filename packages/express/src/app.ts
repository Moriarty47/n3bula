import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';

import autoRegisterRoutes from '@/mw/auto-register';
import { timeoutMwPlugin } from '@/mw/timeout';

import { apiAutoImporter } from '@/util/apis-auto-importer';
import { findFreePort } from '@/util/find-free-port';
import { changeTag, logger, memoryUsage } from '@/util/log';
import { initMsg } from '@/util/msg/index';
import { isDev } from '@/util/utils';

import { NOOP } from '@/const';

import type { Server } from 'node:http';
import type { App, AppConfig, ListenCallback } from '@/types';

const initConfig = (config: AppConfig): AppConfig => ({
  basePath: '/api',
  findNewPort: false,
  printApis: true,
  timeoutOptions: true,
  urlencodedOptions: { extended: true },
  ...config,
});

export async function createApp(
  appConfig: AppConfig = {} as AppConfig,
): Promise<App> {
  appConfig = initConfig(appConfig);
  changeTag(appConfig.logTag);
  await initMsg(appConfig.lang || 'en');

  const app = express()
    .use(
      cookieParser(
        appConfig.cookieParserOptions?.secret,
        appConfig.cookieParserOptions,
      ),
    )
    .use(compression(appConfig.compressionOptions))
    .use(express.json(appConfig.jsonOptions))
    .use(express.urlencoded(appConfig.urlencodedOptions))
    .disable('x-powered-by');

  timeoutMwPlugin(app, appConfig.timeoutOptions);

  const middlewares = appConfig.middlewares || {};

  Object.values(middlewares).forEach(mw => app.use(mw as any));

  await autoRegisterRoutes(app, appConfig);

  const originAppListen = app.listen;

  Object.defineProperty(app, 'listen', {
    value: async (port: number, callback: ListenCallback = NOOP) => {
      const PORT = await findFreePort(
        port,
        appConfig.host,
        appConfig.findNewPort,
      );

      if (PORT !== port)
        logger.warn(`port ${port} is unavailable, using port ${PORT}`);

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

export async function startServer(
  port: number = 8050,
  appConfig: AppConfig = {} as AppConfig,
) {
  const app: App = await createApp(appConfig);
  const server = await app.listen(port, usedPort => {
    logger(
      `Server is running on \x1b[92mhttp://${appConfig.host || 'localhost'}:${usedPort}\x1b[m`,
    );
  });
  return server;
}

if (isDev) {
  startServer(8000, {
    apis: apiAutoImporter(['./src/apis']),
  });
  memoryUsage();
}
