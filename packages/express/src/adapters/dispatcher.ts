import { Msg } from '$util/msg';
import { statusOk as _statusOk, statusFail as _statusFail } from '$util/msg/status';

import type { Response } from 'express';
import type { ResponseOk, ResponseFail } from './response';
import type { StatusOk, StatusFail } from '$util/msg/status';

let statusOk = { ..._statusOk };
let statusFail = { ..._statusFail };

export function getDispatchStatus<T extends 0 | 1>(code: T): T extends 0 ? StatusOk : StatusFail {
  return (code === 0 ? statusOk : statusFail) as any;
}

export function extendDispatchStatus<T extends Record<string, number>>(patchOk: T, patchFail: T) {
  statusOk = { ...statusOk, ...patchOk };
  statusFail = { ...statusFail, ...patchFail };

  return dispatchStatus;
}

export function dispatchStatus<T extends ResponseOk | ResponseFail>(res: Response, payload: T) {
  const { code, type, ...message } = payload;

  const statusList = getDispatchStatus(code);
  const status = (statusList as any)[type] as number | undefined;

  if (status)
    return res.status(status).json({
      code,
      ...message,
    });

  return res.status(500).json(message || Msg.FAIL());
}
