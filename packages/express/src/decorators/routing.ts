import { getResponseAdapter } from '@/adapter/response';
import { errorHandlerMw } from '@/mw/error-handler';

import { assertsDefined } from '@/util/asserts';
import { createRouteTableLogger, logger } from '@/util/log';

import { ROUTE_CLASS_NAME, ROUTE_MIDDLEWARES, ROUTE_PREFIX } from '@/const';

import type { Express } from 'express';
import type {
  AppConfig,
  ExpRequestHandler,
  RouteConstructor,
  RouteInstance,
} from '@/types';

function getBoundHandler(
  instance: RouteInstance,
  handler: ExpRequestHandler,
): ExpRequestHandler {
  return async (req, res, next) => {
    const responseAdapter = getResponseAdapter();
    try {
      return responseAdapter.success(
        res,
        await Promise.resolve(handler.call(instance, req, res, next)),
      );
    } catch (error: any) {
      return responseAdapter.error(res, error);
    }
  };
}

export function registerRoutes<T extends readonly RouteConstructor[]>(
  app: Express,
  appConfig: AppConfig,
  ...controllers: T
) {
  const { basePath = '/api', printApis = true } = appConfig;

  const routeTableLogger = createRouteTableLogger(printApis);

  controllers.forEach(Ctrl => {
    const inst = typeof Ctrl === 'function' ? new Ctrl() : Ctrl;

    const metadata = Ctrl[Symbol.metadata];
    const { routes, router } = metadata;
    const routeBasePath = `${basePath}${metadata[ROUTE_PREFIX]}`;

    if (!routes) return;

    routes.forEach(route => {
      const m = route.method;
      if (!router[m]) {
        logger.warn(`[${m}] has not supported.`);
        return;
      }

      const handler = inst[route.handlerName];
      assertsDefined(
        handler,
        `Handler ${route.handlerName} not found on constructor ${metadata[ROUTE_CLASS_NAME]}`,
      );

      router[m](
        route.path,
        ...(metadata[ROUTE_MIDDLEWARES] || []),
        ...(route.middlewares || []),
        getBoundHandler(inst, handler),
      );

      routeTableLogger.add(m, routeBasePath, route);
    });

    app.use(
      routeBasePath,
      errorHandlerMw(() => router),
    );
  });
  routeTableLogger.print();
}
