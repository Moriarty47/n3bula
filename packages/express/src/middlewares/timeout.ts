import { isArray } from '@n3bula/utils';

import type { Express, NextFunction, Request, Response } from 'express';
import type { TimeoutOptions } from '@/types';

const apiTimeout = 60 * 1000; // 60s
export function timeoutMw(options?: Exclude<TimeoutOptions, boolean | number>) {
  const {
    reqTimeout = apiTimeout,
    resTimeout = reqTimeout,
    whiteList,
  } = options || {};

  return (req: Request, res: Response, next: NextFunction) => {
    if (isArray(whiteList)) {
      if (whiteList.some(url => req.url.includes(url))) return next();
    } else if (typeof whiteList === 'function') {
      if (whiteList(req, res)) return next();
    }

    req.setTimeout(reqTimeout, () => {
      const err = new Error('Request Timeout');
      (err as any).status = 408;
      next(err);
    });
    res.setTimeout(resTimeout, () => {
      const err = new Error('Response Timeout');
      (err as any).status = 503;
      next(err);
    });
    next();
  };
}

export function timeoutMwPlugin(app: Express, options?: TimeoutOptions) {
  if (
    typeof options === 'undefined'
    || (typeof options === 'boolean' && options)
  ) {
    app.use(timeoutMw());
  } else if (typeof options === 'number') {
    app.use(
      timeoutMw({
        reqTimeout: options,
        resTimeout: options,
      }),
    );
  } else if (options && typeof options === 'object') {
    app.use(timeoutMw(options));
  }
}
