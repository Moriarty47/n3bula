import { resolve } from 'node:path';
import { cwd } from 'node:process';

export function dynamic(id: string) {
  // eslint-disable-next-line ts/no-require-imports
  return require(require.resolve(id, {
    paths: [
      cwd(),
      resolve(__dirname, '..'),
    ],
  }));
}
