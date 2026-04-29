import { defineConfig } from 'tsdown';
import Replace from 'unplugin-replace/rolldown';

import type { UserConfig } from 'tsdown';

const { MODE = 'dev', ENV = 'both' } = process.env;
const isDev = MODE === 'dev';
const commonConfig = (env: 'node' | 'browser') => ({
  define: {
    'import.meta.env.MODE': `"${MODE}"`,
    MODE: `"${MODE}"`,
    'process.env.MODE': `"${MODE}"`,
  },
  deps: { neverBundle: ['csstype'] },
  dts: { tsconfig: `./tsconfig.${env}.json` },
  entry: `./src/${env}/index.ts`,
  inputOptions: {
    transform: {
      dropLabels: isDev ? [] : ['DEBUG'],
    },
  },
  outputOptions: {
    cleanDir: false,
    dir: `dist/${env}`,
  },
  platform: env,
});

const options: UserConfig[] = [];

if (ENV === 'node') {
  addNodeConfig();
} else if (ENV === 'browser') {
  addBrowserConfig();
} else {
  addNodeConfig();
  addBrowserConfig();
}

export default defineConfig(options);

function addBrowserConfig() {
  options.push({
    ...commonConfig('browser'),
    format: {
      cjs: {
        dts: false,
        target: ['es2015'],
      },
      esm: {
        target: ['es2015'],
      },
      umd: {
        dts: false,
        globalName: 'N3bulaEcho',
        target: ['es2015'],
      },
    },
    plugins: [
      Replace({
        enforce: 'pre',
        values: [
          {
            find: 'typeof process',
            replacement: '"undefined"',
          },
        ],
      }),
    ],
  });
}

function addNodeConfig() {
  options.push({
    ...commonConfig('node'),
    format: {
      cjs: {
        dts: false,
        target: ['node20'],
      },
      esm: {
        target: ['node20'],
      },
    },

    inputOptions: {
      watch: {
        clearScreen: true,
      },
    },
    onSuccess: (isDev && ENV === 'node') ? 'node dist/node/index.mjs' : '',
    plugins: [
      Replace({
        enforce: 'pre',
        values: [
          {
            find: 'typeof process',
            replacement: '"object"',
          },
        ],
      }),
    ],
  });
}
