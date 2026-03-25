import { echo } from '@n3bula/echo/node';

export const createLogger = (tag?: string) => {
  const logger = ((...msg: any[]) => {
    tag ? echo.fg.cyan(tag, ...msg) : echo.fg.cyan(...msg);
  }) as {
    (...msg: any[]): void;
    info(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
  };

  logger.info = (...msg: any[]) => {
    tag ? echo.fg('#66b5ff')(tag, ...msg) : echo.fg('#66b5ff')(...msg);
  };

  logger.warn = (...msg: any[]) => {
    tag ? echo.fg('#ff9966')(tag, ...msg) : echo.fg('#ff9966')(...msg);
  };

  logger.error = (...msg: any[]) => {
    tag ? echo.fg.orangeRed(tag, ...msg) : echo.fg.orangeRed(...msg);
  };

  return logger;
};

export const logger = createLogger('@n3bula/sandbox');
