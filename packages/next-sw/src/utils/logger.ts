/* eslint-disable no-console */
import { dynamic } from './dynamic';

import type { ChalkFunction } from '../types';

let chalk: {
  cyan: ChalkFunction;
  red: ChalkFunction;
  yellow: ChalkFunction;
  green: ChalkFunction;
  magenta: ChalkFunction;
};

try {
  chalk = dynamic('next/dist/compiled/chalk');
} catch {
  chalk = dynamic('chalk');
}

const prefixes = {
  error: `- ${chalk.red('error')}`,
  event: `- ${chalk.magenta('event')}`,
  info: `- ${chalk.cyan('info')}`,
  ready: `- ${chalk.green('ready')}`,
  wait: `- ${chalk.cyan('wait')}`,
  warn: `- ${chalk.yellow('warn')}`,
};

export const logger = {
  error(message: string) {
    console.error(prefixes.error, message);
  },
  event(message: string) {
    console.log(prefixes.event, message);
  },
  info(message: string) {
    console.info(prefixes.info, message);
  },
  ready(message: string) {
    console.log(prefixes.ready, message);
  },
  wait(message: string) {
    console.log(prefixes.wait, message);
  },
  warn(message: string) {
    console.warn(prefixes.warn, message);
  },
};
