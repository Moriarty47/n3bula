import { logger } from './log';
import { getResponseAdapter } from '$adapter/response';

import type { Router } from 'express';
import type { ExpNextFn, ExpRequest, ExpResponse } from '$types';

export function errorHandler(register: () => Router): Router {
  const router = register();
  router.use((err: any, _req: ExpRequest, res: ExpResponse, _next: ExpNextFn) => {
    logger.error('Router Error ', err.stack);
    getResponseAdapter().error(res, err);
  });
  return router;
}
