import express from 'express';

import {
  ROUTE_CLASS,
  ROUTE_CLASS_NAME,
  ROUTE_HAS_WRAPPED,
  ROUTE_MIDDLEWARES,
  ROUTE_PREFIX,
} from '@/const';

import { isMultipleInvoke } from './utils';

import type { RequestHandler } from 'express';
import type { HttpMethod } from './methods';

export type Route = {
  path: string;
  method: HttpMethod;
  handlerName: string;
  middlewares?: RequestHandler[];
};

export function Route(prefix: string = '', ...middlewares: RequestHandler[]) {
  return <T extends new (...rest: any[]) => any>(
    target: T,
    context: ClassDecoratorContext,
  ) => {
    if (context.kind !== 'class')
      throw new Error('@Route can only be used for route class');

    if (isMultipleInvoke(context, ROUTE_HAS_WRAPPED, 'Route')) return target;

    const metadata = context.metadata as Record<symbol | string, any>;
    if (metadata) {
      metadata[ROUTE_CLASS] = true;
      metadata[ROUTE_CLASS_NAME] = context.name;
      metadata[ROUTE_PREFIX] = prefix;
      metadata[ROUTE_MIDDLEWARES] = middlewares;
      metadata.routes = [];
      metadata.router = express.Router();
    }
    return target;
  };
}
