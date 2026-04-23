import { registerRoutes } from '@/deco/routing';

import DefaultApi from '@/util/default-api';
import { logger } from '@/util/log';

import type { Express } from 'express';
import type { AppConfig, RouteImporter } from '@/types';

export default async function autoRegisterRoutes(
  app: Express,
  apiConfig: AppConfig,
) {
  const { apiDir, apis: inputApis, basePath = '/api' } = apiConfig;

  let apiImporters: RouteImporter[] = [];

  let apis = inputApis || apiDir;
  if (typeof apis === 'function') {
    apis = await apis();
  } else if (typeof apis.then === 'function') {
    apis = await apis;
  }
  apiImporters = Object.values(apis || {});

  if (apiImporters.length === 0) {
    logger('No apis folder found, registering default test api');
    registerRoutes(app, basePath, DefaultApi);
    return;
  }
  try {
    const routeRegisters = apiImporters.map(r => r());
    registerRoutes(
      app,
      basePath,
      ...(await Promise.all(routeRegisters)).map(m => m.default),
    );
  } catch (error) {
    logger.error(error);
  }
}
