import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NovaOptions } from '@n3bula/nova';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: NovaOptions = {
  input: {
    'i18n/en': resolve(__dirname, 'src/utils/msg/i18n/en.ts'),
    'i18n/zh': resolve(__dirname, 'src/utils/msg/i18n/zh.ts'),
    index: resolve(__dirname, 'src/index.ts'),
    status: resolve(__dirname, 'src/utils/msg/status.ts'),
  },
  nova: {
    input: resolve(__dirname, 'src/index.ts'),
    outputDtsFile: resolve(__dirname, 'src/index.ts'),
    replace: {
      values: ((mode: string) => {
        return {
          "process.env.NOVA_MODE === 'DEV'": mode === 'DEV',
        };
      }) as any,
    },
  },
  output: {
    dir: 'dist',
  },
};

export default config;
