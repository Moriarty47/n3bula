import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { NovaOptions } from '@n3bula/nova';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: NovaOptions = {
  nova: {
    input: resolve(__dirname, 'src/index.ts'),
    replace: {
      values: ((mode: string) => {
        return {
          "process.env.NOVA_MODE === 'DEV'": mode === 'DEV',
        };
      }) as any,
    },
  },
};

export default config;
