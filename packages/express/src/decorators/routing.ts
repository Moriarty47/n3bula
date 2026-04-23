import express from 'express';

import { echo } from '@n3bula/echo/node';

import { getResponseAdapter } from '@/adapter/response';
import { errorHandler } from '@/mw/error-handler';

import { logger } from '@/util/log';
import { assertsDefined, spaces } from '@/util/utils';

import { TAG } from '@/const';

import type { Express, Router as ExpressRouter, RequestHandler } from 'express';
import type { ExpNextFn, ExpRequest, ExpResponse } from '@/types';

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

export type Route = {
  path: string;
  method: HttpMethod;
  handlerName: string;
  middlewares?: RequestHandler[];
};

export const ROUTE_PREFIX = Symbol('route-prefix');
export const ROUTE_MIDDLEWARES = Symbol('route-mws');

export function Route(prefix: string = '', ...middlewares: RequestHandler[]) {
  return <T extends new (...rest: any[]) => any>(
    target: T,
    context: ClassDecoratorContext,
  ) => {
    if (context.kind === 'class') {
      const Ctrl = class extends target {
        router: ExpressRouter = express.Router();
      };
      context.addInitializer(() => {
        (Ctrl as any).prototype[ROUTE_PREFIX] = prefix;
        (Ctrl as any).prototype[ROUTE_MIDDLEWARES] = middlewares;
      });
      return Ctrl as T;
    }
  };
}

const routeMap: Record<string, Route[]> = Object.create(null);

const addRoute = (prefix: string, routeMeta: Route) => {
  if (!routeMap[prefix]) routeMap[prefix] = [];
  routeMap[prefix].push(routeMeta);
};

function createHttpMethodDecorator(method: HttpMethod) {
  return (path: string, ...middlewares: RequestHandler[]) =>
    (
      _target: (...args: any[]) => any,
      context: ClassMethodDecoratorContext,
    ) => {
      if (context.kind === 'method') {
        context.addInitializer(function () {
          addRoute((this as any)[ROUTE_PREFIX], {
            handlerName: context.name as string,
            method,
            middlewares: middlewares.length ? middlewares : undefined,
            path,
          });
        });
      }
    };
}

export const Get = createHttpMethodDecorator('get');
export const Post = createHttpMethodDecorator('post');
export const Put = createHttpMethodDecorator('put');
export const Delete = createHttpMethodDecorator('delete');
export const Patch = createHttpMethodDecorator('patch');
export const Options = createHttpMethodDecorator('options');
export const Head = createHttpMethodDecorator('head');

export function registerRoutes<T extends readonly (new () => any)[]>(
  app: Express,
  basePath: string,
  ...controllers: T
) {
  controllers.forEach(Ctrl => {
    const inst = (typeof Ctrl === 'function' ? new Ctrl() : Ctrl) as {
      [ROUTE_PREFIX]: string;
      [ROUTE_MIDDLEWARES]: RequestHandler[];
      router: ExpressRouter;
    } & {
      [k: string]: (req: ExpRequest, res: ExpResponse, next: ExpNextFn) => any;
    };
    const routes = routeMap[inst[ROUTE_PREFIX]];
    routes.forEach(route => {
      const handler = inst[route.handlerName];

      assertsDefined(
        handler,
        `Handler ${route.handlerName} not found on controller ${inst.constructor.name}`,
      );

      const boundHandler: RequestHandler = async (req, res, next) => {
        const responseAdapter = getResponseAdapter();
        try {
          return responseAdapter.success(
            res,
            await Promise.resolve(handler.call(inst, req, res, next)),
          );
        } catch (error: any) {
          return responseAdapter.error(res, error);
        }
      };

      if (!inst.router[route.method]) {
        logger.warn(`${route.method} not supported.`);
        return;
      }

      inst.router[route.method](
        route.path,
        ...(inst[ROUTE_MIDDLEWARES] || []),
        ...(route.middlewares || []),
        boundHandler,
      );
    });

    const routePath = `${basePath}${inst[ROUTE_PREFIX]}`;
    logger(
      `register api: ${echo.fg.lightGreen.toString(routePath)}\n`
        + routes
          .map(
            r =>
              `${spaces(TAG.length + 1)}${echo.fg.lightGreen.toString(`${r.method} -> ${routePath}${r.path}`)}`,
          )
          .join('\n'),
    );
    app.use(
      routePath,
      errorHandler(() => inst.router),
    );
  });
}
