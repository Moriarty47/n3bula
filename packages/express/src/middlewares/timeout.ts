import type { NextFunction, Request, Response } from 'express';

const apiTimeout = 60 * 1000; // 60s
export default function timeout(req: Request, res: Response, next: NextFunction) {
  if (req.url.includes('/upload')) return next();
  req.setTimeout(apiTimeout, () => {
    const err = new Error('Request Timeout');
    (err as any).status = 408;
    next(err);
  });
  res.setTimeout(apiTimeout, () => {
    const err = new Error('Response Timeout');
    (err as any).status = 503;
    next(err);
  });
  next();
}
