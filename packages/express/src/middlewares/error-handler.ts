import { getResponseAdapter } from '@/adapter/response';

import { logger } from '@/util/log';

import type { Router } from 'express';
import type { ExpNextFn, ExpRequest, ExpResponse } from '@/types';

export function errorHandlerMw(register: () => Router): Router {
  const router = register();
  router.use(
    (err: any, _req: ExpRequest, res: ExpResponse, _next: ExpNextFn) => {
      if (err.stack) {
        logger.error('Router Error ', err.stack);
      } else {
        logger.info(err.type, err.data || err.msg);
      }
      getResponseAdapter().error(res, err);
    },
  );
  return router;
}
