import { echo } from '@n3bula/echo/node';

import { NOOP, TAG } from '@/const';

import type { Route } from '@/deco/route';

let currentTag = TAG;

export const changeTag = (tag?: string) => (currentTag = tag ?? TAG);

const format = (msg: any[]) => (currentTag ? [currentTag, ...msg] : msg);

export const logger = ((...msg: any[]) => {
  echo.fg.cyan(...format(msg));
}) as {
  (...msg: any[]): void;
  info(...msg: any[]): void;
  warn(...msg: any[]): void;
  error(...msg: any[]): void;
};

logger.info = (...msg: any[]) => {
  echo.fg('#66b5ff')(...format(msg));
};

logger.warn = (...msg: any[]) => {
  echo.fg('#ff9966')(...format(msg));
};

logger.error = (...msg: any[]) => {
  echo.fg.orangeRed(...format(msg));
};

export const createRouteTableLogger = (printApis?: boolean) => {
  if (!printApis) return { add: NOOP, print: NOOP };

  const table: Record<string, Record<string, string[]>> = {};

  const add = (method: string, routeBasePath: string, route: Route) => {
    method = method.toUpperCase();
    const routeBase = (table[routeBasePath] ||= {});
    (routeBase[method] ||= []).push(`${routeBasePath}${route.path}`);
  };

  const print = () => {
    logger('Registered apis:');
    console.table(table);
  };

  return { add, print };
};

export const memoryUsage = () => {
  const getMemo = () => {
    const used = process.memoryUsage();
    // Save the cursor to the memoized position
    process.stdout.write('\x1b[s');

    // Update the cursor to the very top position (0, 0)
    process.stdout.write('\x1b[H');
    console.table(
      Object.entries(used).reduce(
        (obj, [key, val]) => {
          obj[key] = `${Math.round((val / 1024 / 1024) * 100) / 100} MB`;
          return obj;
        },
        {} as Record<string, string>,
      ),
    );

    // Restore the cursor to the memoized position
    process.stdout.write('\x1b[u');
  };

  getMemo();
  setInterval(getMemo, 1e4);
};
