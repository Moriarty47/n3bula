import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
 

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      outDir: path.resolve(__dirname, './lib'),
      emptyOutDir: true,
      sourcemap: mode === 'development',
      minify: mode === 'development' ? false : 'esbuild',
    }
  };
});