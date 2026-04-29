import { capitalize } from '@n3bula/utils';

import { assertsRouteMethodDecorator } from './utils';

import type { RequestHandler } from 'express';
import type { ExpRequestHandler } from '@/types';

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

function createHttpMethodDecorator(method: HttpMethod) {
  return (path: string, ...middlewares: RequestHandler[]) =>
    (target: ExpRequestHandler, context: ClassMethodDecoratorContext) => {
      context.addInitializer(() => {
        assertsRouteMethodDecorator(context, capitalize(method));
        const metadata = context.metadata as Record<symbol | string, any>;
        if (!metadata?.routes) return;
        metadata.routes.push({
          handlerName: context.name as string,
          method,
          middlewares,
          path,
        });
      });
      return target;
    };
}

export const Get = createHttpMethodDecorator('get');
export const Post = createHttpMethodDecorator('post');
export const Put = createHttpMethodDecorator('put');
export const Delete = createHttpMethodDecorator('delete');
export const Patch = createHttpMethodDecorator('patch');
export const Options = createHttpMethodDecorator('options');
export const Head = createHttpMethodDecorator('head');
