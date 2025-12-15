import { TAG } from '$const';
import { echo } from '@n3bula/echo/node';

export const createLogger = (tag: string) => {
  const logger = ((...msg: any[]) => {
    echo.fg.cyan(tag, ...msg);
  }) as {
    (...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
  };

  logger.warn = (...msg: any[]) => {
    echo.fg('#ff9966')(tag, ...msg);
  };

  logger.error = (...msg: any[]) => {
    echo.fg.orangeRed(tag, ...msg);
  };

  return logger;
};

export const logger = createLogger(TAG);
