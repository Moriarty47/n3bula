import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  root: path.resolve(__dirname, 'demo'),
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      root: path.resolve(__dirname, './'),
      strictOutput: true,
      compilerOptions: {
        declaration: true,
        typeRoots: ['./dist/index.d.ts']
      }
    }),
  ],
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      formats: ['es', 'umd'],
      fileName: 'index',
      name: 'N3bulaEcho',
    },
  }
});