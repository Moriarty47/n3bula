import { dynamic } from './dynamic';
import { logger } from './logger';

import type { Webpack } from '../types';

function semver(version: string) {
  if (typeof version === 'string') {
    return version
      .split('.')
      .slice(0, 3)
      .map(Number);
  }

  return [0, 0, 0];
}

function valid(fn?: Webpack): fn is Webpack {
  return typeof fn === 'function' &&
    typeof fn.version === 'string' &&
    typeof fn.DefinePlugin === 'function';
}

export function ensureWebpack(webpack?: Webpack): Webpack {
  let version = [0, 0, 0];

  const avaliable = [
    () => webpack,
    () => dynamic('next/dist/compiled/webpack/bundle5'),
    () => dynamic('webpack'),
  ];

  for (const check of avaliable) {
    try {
      const provided = check();

      if (valid(provided)) {
        version = semver(provided.version);

        if (version[0] === 5 && version[1] >= 64) return provided;
      }
    } catch { }
  }

  logger.error(`@n3bula/next-sw depends on at least webpack@5.64.0 but only webpack@${version[0] || 0}.${version[1] || 0}.${version[2] || 0} was found`);
  process.exit(2);
}
