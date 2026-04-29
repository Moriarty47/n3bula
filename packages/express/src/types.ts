import type { Server } from 'node:http';
import type { CompressionOptions } from 'compression';
import type { CookieParseOptions } from 'cookie-parser';
import type express from 'express';
import type {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from 'express';
import type {
  ROUTE_CLASS_NAME,
  ROUTE_MIDDLEWARES,
  ROUTE_PREFIX,
} from '@/const';
import type { Route } from './decorators/route';

export type ParsedQs = {
  [key: string]: undefined | string | ParsedQs | (string | ParsedQs)[];
};

export type ExpRequest<ReqBody = any, ReqQuery = ParsedQs> = Request<
  any,
  any,
  ReqBody,
  ReqQuery
>;

export type ExpResponse<ResBody = any> = Response<ResBody, Record<string, any>>;

export type ExpNextFn = NextFunction;

export type ExpApiArgs<ReqBody = any, ReqQuery = ParsedQs, ResBody = any> = [
  ExpRequest<ReqBody, ReqQuery>,
  ExpResponse<ResBody>,
  ExpNextFn,
];

export type ExpRequestHandler<R = any> = (
  req: ExpRequest,
  res: ExpResponse,
  next: ExpNextFn,
) => R;

export type RouteInstance = {
  [k: string]: ExpRequestHandler;
};

export type RouteConstructor<T = any> = (new () => T) & {
  [Symbol.metadata]: {
    router: Router;
    routes: Route[];
    [ROUTE_CLASS_NAME]: string;
    [ROUTE_PREFIX]: string;
    [ROUTE_MIDDLEWARES]: RequestHandler[];
  };
};

export type RouteRegister = {
  default: RouteConstructor;
};

export type RouteImporter = () => Promise<RouteRegister>;

export type ApiDir =
  | Record<string, RouteImporter>
  | Promise<Record<string, RouteImporter>>
  | (() => Promise<Record<string, RouteImporter>>);

export type OneOf<T extends Record<string, any>> = {
  [K in keyof T]: { [P in K]: T[K] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];

export type TimeoutOptions =
  | boolean
  | number
  | {
      reqTimeout?: number;
      resTimeout?: number;
      whiteList?: string[] | ((req: Request, res: Response) => boolean);
    };

export type AppConfig = {
  /** Base path for all routes (default: '/api') */
  basePath?: string;
  /** Find new port if current port is unavailable (default: true) */
  findNewPort?:
    | boolean
    | {
        timeout?: number;
        maxPort?: number;
      };
  // Hostname
  host?: string;
  /** Response i18n */
  lang?: 'zh' | 'en';
  /** Change log tag (default: '@n3bula/express') */
  logTag?: string;
  /** Global middlewares */
  middlewares?: Record<
    string,
    RequestHandler | RequestHandler[] | [string, RequestHandler]
  >;
  cookieParserOptions?: CookieParseOptions & {
    secret?: string | string[];
  };
  compressionOptions?: CompressionOptions;
  jsonOptions?: Parameters<typeof express.json>[0];
  urlencodedOptions?: Parameters<typeof express.urlencoded>[0];
  /** Print all registered apis */
  printApis?: boolean;
  /** When is false, disable timeout middleware, when is true, req timeout and res timeout both using default value 60s (default: true) */
  timeoutOptions?: TimeoutOptions;
} & OneOf<{
  /**
   * @deprecated using 'apis' instead
   */
  apiDir: ApiDir;
  /** Apis */
  apis: ApiDir;
}>;

export type ListenCallback = (usedPort: number) => void;

export type App = Omit<Express, 'listen'> & {
  listen: (port: number, callback?: ListenCallback) => Promise<Server>;
};
