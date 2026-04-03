import path from 'node:path';

import Replace from 'unplugin-replace/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, './src/browser/index.ts'),
      fileName: 'index',
      formats: ['es', 'umd'],
      name: 'N3bulaEcho',
    },
    outDir: path.resolve(__dirname, './dist'),
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    dts({
      compilerOptions: {
        declaration: true,
        typeRoots: ['./dist/index.d.ts'],
      },
      insertTypesEntry: true,
      rollupTypes: true,
      root: path.resolve(__dirname, './'),
      strictOutput: true,
    }) as any,
    Replace({
      enforce: 'pre',
      values: [
        {
          find: 'process.env.DEV',
          replacement: '"false"',
        },
        {
          find: 'typeof process',
          replacement: '"undefined"',
        },
        {
          find: 'import.meta.env.DEV',
          replacement: 'false',
        },
        {
          find: /\s*debugLog\(.*\)\(\)/,
          replacement: '',
        },
      ],
    }),
  ],
});
