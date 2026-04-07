import { echo } from '@n3bula/echo/node';

import { TAG } from '@/const';

let currentTag = TAG;

export const changeTag = (tag?: string) => currentTag = tag || TAG;

export const logger = ((...msg: any[]) => {
  echo.fg.cyan(currentTag, ...msg);
}) as {
  (...msg: any[]): void;
  warn(...msg: any[]): void;
  error(...msg: any[]): void;
};

logger.warn = (...msg: any[]) => {
  echo.fg('#ff9966')(currentTag, ...msg);
};

logger.error = (...msg: any[]) => {
  echo.fg.orangeRed(currentTag, ...msg);
};


