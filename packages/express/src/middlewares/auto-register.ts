import { registerRoutes } from '$deco/routing';

import DefaultApi from '$util/default-api';
import { errorLogger, logger } from '$util/log';

import type { Express } from 'express';
import type { AppConfig, RouteImporter } from '../types';

export default async function autoRegisterRoutes(app: Express, apiConfig: AppConfig) {
  const { apiDir, apis } = apiConfig;

  let apiImporteers: RouteImporter[] = [];
  if (apiDir) {
    // auto
    apiImporteers = Object.values(apiDir || {});
  } else if (apis) {
    // manual
    apiImporteers = Object.values(apis || {});
  }

  if (apiImporteers.length === 0) {
    logger('No apis folder found, registing default test api');
    registerRoutes(app, '/api', DefaultApi);
    return;
  }
  try {
    const routeRegisters = apiImporteers.map(r => r());
    registerRoutes(app, '/api', ...(await Promise.all(routeRegisters)).map(m => m.default));
  } catch (error) {
    errorLogger(error);
  }
}
