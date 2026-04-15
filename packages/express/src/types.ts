import type { Server } from 'node:http';
import type { Express, RequestHandler } from 'express';

export type ExpRequest = Parameters<RequestHandler>[0];
export type ExpResponse = Parameters<RequestHandler>[1];
export type ExpNextFn = Parameters<RequestHandler>[2];

export type RouteRegister = {
  default: new () => any;
};

export type RouteImporter = () => Promise<RouteRegister>;
export type ApiDir = Record<string, RouteImporter>;

export type OneOf<T extends Record<string, any>> = {
  [K in keyof T]: { [P in K]: T[K] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];

export type AppConfig = {
  /** base path for all routes, default '/api' */
  basePath?: string;
  /** find new port if current port is unavailable */
  findNewPort?: boolean;
  logTag?: string;
  middlewares?: Record<
    string,
    RequestHandler | RequestHandler[] | [string, RequestHandler]
  >;
  lang?: 'zh' | 'en';
} & OneOf<{
  apiDir: ApiDir;
  apis: ApiDir;
}>;

export type ListenCallback = (usedPort: number) => void;
export type App = Omit<Express, 'listen'> & {
  listen: (port: number, callback?: ListenCallback) => Promise<Server>;
};
