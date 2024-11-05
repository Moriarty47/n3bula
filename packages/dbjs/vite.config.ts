import path from 'path';
import { defineConfig } from 'vite';
import { vitePluginNodeBundler } from '@n3bula/vite-plugin-node-bundler';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [
      vitePluginNodeBundler({
        cjsEnv: true,
        ...(mode === 'development' ? {} : { bundle: true }),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '$test': path.resolve(__dirname, './test'),
      },
    },
    build: {
      outDir: path.resolve(__dirname, './dist'),
      emptyOutDir: true,
      sourcemap: true,
      minify: mode === 'development' ? false : 'esbuild',
    }
  };
});
