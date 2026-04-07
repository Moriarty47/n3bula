import { Msg } from '@/util/msg';
import {
  statusFail as _statusFail,
  statusOk as _statusOk,
} from '@/util/msg/status';
import { isError } from '@/util/utils';

import type { Response } from 'express';
import type { StatusFail, StatusOk } from '@/util/msg/status';
import type { ResponseFail, ResponseOk } from './response';

let statusOk = { ..._statusOk };
let statusFail = { ..._statusFail };

export function getDispatchStatus<T extends 0 | 1>(
  code: T,
): T extends 0 ? StatusOk : StatusFail {
  return (code === 0 ? statusOk : statusFail) as any;
}

export function extendDispatchStatus<T extends Record<string, number>>(
  patchOk: T,
  patchFail: T,
) {
  statusOk = { ...statusOk, ...patchOk };
  statusFail = { ...statusFail, ...patchFail };

  return dispatchStatus;
}
const omitType = <T extends { type?: any }>(payload: T): Omit<T, 'type'> => {
  const { type, ...result } = payload;
  return result;
};
export function dispatchStatus<T extends ResponseOk | ResponseFail | Error>(
  res: Response,
  payload: T,
) {
  if (isError(payload))
    return res.status(500).json(omitType(Msg.FAIL(payload)));

  const { code, type, ...message } = payload;

  const statusList = getDispatchStatus(code);
  const status = (statusList as any)[type] as number | undefined;

  if (status)
    return res.status(status).json({
      code,
      ...message,
    });

  return res.status(500).json(message || omitType(Msg.FAIL()));
}
