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
    outputDtsFile: resolve(__dirname, 'src/index.ts'),
  },
  input: {
    index: resolve(__dirname, 'src/index.ts'),
    'en/ok': resolve(__dirname, 'src/utils/msg/en/ok.ts'),
    'en/fail': resolve(__dirname, 'src/utils/msg/en/fail.ts'),
    'zh/ok': resolve(__dirname, 'src/utils/msg/zh/ok.ts'),
    'zh/fail': resolve(__dirname, 'src/utils/msg/zh/fail.ts'),
    status: resolve(__dirname, 'src/utils/msg/status.ts'),
  },
  output: {
    dir: 'dist',
  },
};

export default config;
