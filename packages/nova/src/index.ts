import minimist from 'minimist';

import { novaDev } from './nova-dev';
import { novaBuild } from './nova-build';

import { getConfig, getEnvPath, logger } from './util';

import type { NovaOptions } from './types';

export type { NovaOptions };

const argv = minimist(process.argv.slice(2), {
  '--': true,
});
const isDevMode = !(argv._[0] === 'build');

async function main() {
  try {
    const config = await getConfig();
    if (isDevMode) {
      // nova [=dev]
      novaDev(config, getEnvPath(argv.env, isDevMode), argv['--']);
    } else {
      // nova build
      await novaBuild(config, getEnvPath(argv.env, isDevMode));
    }
  } catch (error) {
    logger.error(error);
  }
}

main();
