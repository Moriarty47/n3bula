import fs from 'node:fs';
import path from 'node:path';

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const srcDirPath = path.resolve(__dirname, './src');
  const srcFiles = fs.readdirSync(srcDirPath);

  return {
    build: {
      emptyOutDir: true,
      lib: {
        entry: srcFiles.map(pt => path.resolve(srcDirPath, pt)),
        fileName: (format, entryName) => {
          if (format === 'cjs') {
            return `cjs/${entryName}.cjs`;
          }
          return `esm/${entryName}.mjs`;
        },
        formats: ['es', 'cjs'],
      },
      minify: mode === 'development' ? false : 'esbuild',
      outDir: path.resolve(__dirname, './lib'),
      rollupOptions: {
        external: ['path'],
      },
      sourcemap: mode === 'development',
    },
    resolve: {
      alias: {
        '@': srcDirPath,
      },
    },
  };
});
