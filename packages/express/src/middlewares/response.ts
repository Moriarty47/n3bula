import { Msg } from '$util/msg';
import { errorLogger } from '$util/log';

import type { NextFunction, Request, Response, Router } from 'express';

export const RESPONSE_TYPE = {
  CREDENTIALS: 0,
  TOKEN: 1,
  FORBIDDEN: 2,
  SUCCESS: 3,
  FAIL: 4,
  FILE_FILTER: 5,
  MISSING_KEYS: 6,
  NOT_FOUND_DATA: 7,
  NOT_FOUND_FILE: 8,
  UPLOAD_FAIL: 9,
} as const;

export type ResponseType = keyof typeof RESPONSE_TYPE | (string & {});

export const ResponseAdapter = {
  success(res: Response, payloads: { type?: 'SUCCESS'; [k: string]: any } = {}) {
    const { type, ...message } = payloads;
    return dispatchStatus(res, type, message);
  },
  error(res: Response, error: { type?: Exclude<ResponseType, 'SUCCESS'>; [k: string]: any } = {}) {
    const { type, ...message } = error;
    return dispatchStatus(res, type, message);
  },
  send(res: Response, status: number, data: any) {
    return res.status(status).send(data);
  },
};

function dispatchStatus(res: Response, type?: ResponseType, message?: any) {
  switch (type) {
    case 'SUCCESS': {
      return res.status(200).json(message);
    }
    case 'FAIL':
    case 'FILE_FILTER':
    case 'UPLOAD_FAIL': {
      return res.status(400).json(message);
    }
    case 'CREDENTIALS':
    case 'TOKEN': {
      return res.status(401).json(message);
    }
    case 'FORBIDDEN': {
      return res.status(403).json(message);
    }
    case 'NOT_FOUND_DATA':
    case 'NOT_FOUND_FILE': {
      return res.status(404).json(message);
    }
    default: {
      return res.status(500).json(type || message || Msg.FAIL());
    }
  }
}

export class FilterError extends Error {
  statusCode: number;
  constructor(options: { msg: string; code?: number; type?: ResponseType }) {
    const { msg, code = 400, type = 'FILE_FILTER' } = options;
    super(msg);
    this.name = type;
    this.statusCode = code;
    this.message = msg;
  }
}

export function errorHandler(register: () => Router): Router {
  const router = register();
  router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    errorLogger('Router Error ', err.stack);
    ResponseAdapter.error(res);
  });
  return router;
}
