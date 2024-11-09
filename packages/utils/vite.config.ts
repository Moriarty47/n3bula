import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {

  const srcDirPath = path.resolve(__dirname, './src');
  const srcFiles = fs.readdirSync(srcDirPath);

  return {
    resolve: {
      alias: {
        '@': srcDirPath,
      }
    },
    build: {
      outDir: path.resolve(__dirname, './lib'),
      emptyOutDir: true,
      lib: {
        entry: srcFiles.map(pt => path.resolve(srcDirPath, pt)),
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          if (format === 'cjs') {
            return `cjs/${entryName}.cjs`;
          }
          return `esm/${entryName}.mjs`;
        },
      },
      sourcemap: mode === 'development',
      minify: mode === 'development' ? false : 'esbuild',
    }
  };
});