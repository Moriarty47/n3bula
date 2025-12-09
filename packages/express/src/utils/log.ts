import { TAG } from '$const';
import { echo } from '@n3bula/echo/node';

export function logger(...msg: any[]): void {
  if (TAG) {
    echo.fg.cyan(TAG, ...msg);
    return;
  }
  echo(TAG, ...msg);
}

export function errorLogger(...msg: any[]): void {
  if (TAG) {
    echo.fg.red(TAG, ...msg);
    return;
  }
  echo(TAG, ...msg);
}
