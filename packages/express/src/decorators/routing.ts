import express from 'express';

import { ResponseAdapter, errorHandler } from '$mw/response';

import { logger } from '$util/log';
import { assertsDefined } from '$util/utils';

import type { Express, Router as ExpressRouter, RequestHandler } from 'express';
import type { ExpNextFn, ExpRequest, ExpResponse } from '../types';
import { TAG } from '$const';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Route = {
  path: string;
  method: HttpMethod;
  handlerName: string;
  middlewares?: RequestHandler[];
};

export const BASE_PATH = Symbol('base-path');

export function Route(basePath: string = '') {
  return function <T extends new (...rest: any[]) => any>(target: T, context: ClassDecoratorContext) {
    if (context.kind === 'class') {
      const Ctrl = class extends target {
        router: ExpressRouter = express.Router();
      };
      context.addInitializer(function () {
        (Ctrl as any).prototype[BASE_PATH] = basePath;
      });
      return Ctrl as T;
    }
  };
}

const routeMap: Record<string, Route[]> = Object.create(null);

const addRoute = (basePath: string, routeMeta: Route) => {
  if (!routeMap[basePath]) routeMap[basePath] = [];
  routeMap[basePath].push(routeMeta);
};

function createHttpMethodDecorator(method: HttpMethod) {
  return function (path: string, ...middlewares: RequestHandler[]) {
    return function (_target: Function, context: ClassMethodDecoratorContext) {
      if (context.kind === 'method') {
        context.addInitializer(function () {
          addRoute((this as any)[BASE_PATH], {
            path,
            method,
            handlerName: context.name as string,
            middlewares: middlewares.length ? middlewares : undefined,
          });
        });
      }
    };
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
      [BASE_PATH]: string;
      router: ExpressRouter;
    } & {
      [k: string]: (req: ExpRequest, res: ExpResponse, next: ExpNextFn) => any;
    };
    const routes = routeMap[inst[BASE_PATH]];
    routes.forEach(route => {
      const handler = inst[route.handlerName];

      assertsDefined(handler, `Handler ${route.handlerName} not found on controller ${inst.constructor.name}`);

      const boundHandler: RequestHandler = (req, res, next) =>
        Promise.resolve(handler.call(inst, req, res, next))
          .then(result => {
            // console.log('result', result);
            return ResponseAdapter.success(res, result);
          })
          .catch(error => {
            // console.error('error', error);
            return ResponseAdapter.error(res, error);
          });

      const finalMiddlewares: RequestHandler[] = [...(route.middlewares || []), boundHandler];

      inst.router[route.method](route.path, ...finalMiddlewares);
    });

    const SPACE = ' '.repeat(TAG.length + 1);
    const routePath = `${basePath}${inst[BASE_PATH]}`;
    logger(
      `register api: ${routePath}\n` +
        routes.map(r => `${SPACE}\x1B[92m${r.method} -> "${routePath}${r.path}"\x1B[m`).join('\n'),
    );
    app.use(
      routePath,
      errorHandler(() => inst.router),
    );
  });
}
