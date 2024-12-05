import { accessSync, constants } from 'node:fs';

import { logger } from './logger';

import type { AddressInfo } from 'node:net';

import type { AccessError, AnyFunction } from '../types';

const INJECT_ENTRY_POINTS = [
  'main-app',
  'pages/_app',
];

export function inject(client: string, entry: Record<string, string | string[]>) {
  let injected = false;

  INJECT_ENTRY_POINTS.forEach((point) => {
    if (point in entry) {
      const files = entry[point];

      if (typeof files === 'string') {
        injected = true;

        if (files === client) {
          return;
        }

        logger.info(`Live reload client is injected to "${point}"`);

        entry[point] = [
          client,
          files,
        ];

        return;
      }

      if (Array.isArray(files)) {
        injected = true;

        if (files.includes(client)) {
          return;
        }

        logger.info(`Live reload client is injected to "${point}"`);

        files.unshift(client);
      }
    }
  });

  if (!injected) {
    logger.error('Live reload client is not injected\n');
  }

  return entry;
}

export const NAME = ':next-sw:';

export const WAIT = 'next-sw:wait';

export const RELOAD = 'next-sw:reload';

export function access(file: string) {
  try {
    accessSync(file, constants.R_OK);

    return null;
  } catch (ex: unknown) {
    return ex as AccessError;
  }
}

export const noop: AnyFunction = () => {
  // Noop
};

export function tapPromiseDelegate() {
  let resolve = noop;
  let reject = noop;

  const promise = new Promise<void>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    promise,
    reject,
    resolve,
  } as const;
}

export function clearErrorStackTrace(error: string) {
  return error.replace(/\n{3,}/g, '\n\n')
    .replace(/^.*Module build failed.*$/m, '')
    .replace(/^\s*at\s[\s\S]+/gm, '')
    .trim();
}

export function once<T extends AnyFunction>(handler: T): T {
  let called = false;
  let value: ReturnType<T> | null = null;

  return function (this: any, ...args: any) {
    if (called) {
      return value;
    }

    value = Reflect.apply(handler, this, args);
    called = true;

    return value;
  } as T;
}

export function terminateWith(handler: () => void) {
  const cb = once(handler);

  [
    'SIGHUP',
    'SIGINT',
    'SIGQUIT',
    'SIGTERM',
  ].forEach((signal) => {
    process.prependListener(signal as NodeJS.Signals, cb);
  });

  process.prependListener('beforeExit', cb);
  process.prependListener('exit', cb);
}

export function formatAddress(address: AddressInfo | string | null) {
  if (address == null) {
    return '<unknown>';
  }

  if (typeof address === 'string') {
    return address;
  }

  if (address.family === 'IPv6') {
    return `[${address.address}]:${address.port}`;
  }

  return `${address.address}:${address.port}`;
}
