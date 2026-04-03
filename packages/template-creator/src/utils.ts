import { echo } from '@n3bula/echo/node';

export {
  camel2kebab,
  capitalize,
  decapitalize,
  kebab2camel,
  sleep,
  useDefer,
} from '@n3bula/utils';

export const logger = {
  error: (msg: any) => echo.fg.red(msg),
  log: (msg: any) => echo.fg.cyan(msg),
  success: (msg: any) => echo.fg.green(msg),
  successTag: (tag: string, msg: any) => echo.fg('green', 'white')(tag, msg),
};

export const greenChalk = (v: string) => echo.fg.limeGreen.toString(v);
