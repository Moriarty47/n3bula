import { logger } from './log';
import { getResponseAdapter } from '$adapter/response';

import type { Router } from 'express';
import type { StatusKey } from '$adapter/dispatcher';
import type { ExpNextFn, ExpRequest, ExpResponse } from '$types';

export class FilterError extends Error {
  statusCode: number;
  constructor(options: { msg: string; code?: number; type?: StatusKey }) {
    const { msg, code = 400, type = 'FILE_FILTER' } = options;
    super(msg);
    this.name = type;
    this.statusCode = code;
    this.message = msg;
  }
}

export function errorHandler(register: () => Router): Router {
  const router = register();
  router.use((err: any, _req: ExpRequest, res: ExpResponse, _next: ExpNextFn) => {
    logger.error('Router Error ', err.stack);
    getResponseAdapter().error(res);
  });
  return router;
}
