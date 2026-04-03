import { defineConfig } from 'tsdown';
import Replace from 'unplugin-replace/rolldown';

export default defineConfig({
  clean: false,
  entry: ['./src/node/index.ts'],
  outputOptions: {
    cleanDir: false,
    entryFileNames(chunk) {
      const name = chunk.name.replace('index', 'node');
      if (name.endsWith('.d')) return `${name}.mts`;
      return `${name}.mjs`;
    },
  },
  platform: 'node',
  plugins: [
    Replace({
      enforce: 'pre',
      values: [
        {
          find: 'process.env.DEV',
          replacement: '"false"',
        },
        {
          find: 'typeof process',
          replacement: '"object"',
        },
      ],
    }),
  ],
});
