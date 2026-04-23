import type { NextFunction, Request, Response } from 'express';

const apiTimeout = 60 * 1000; // 60s
export default function timeout(ms: number = apiTimeout) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.url.includes('/upload')) return next();

    req.setTimeout(ms, () => {
      const err = new Error('Request Timeout');
      (err as any).status = 408;
      next(err);
    });
    res.setTimeout(ms, () => {
      const err = new Error('Response Timeout');
      (err as any).status = 503;
      next(err);
    });
    next();
  };
}
