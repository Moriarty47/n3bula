import { toInt } from '.';

export const TAG = 'MiniRedis';

export const LF = '\r\n';

export const PORT = toInt(process.env.PORT || '6379');
