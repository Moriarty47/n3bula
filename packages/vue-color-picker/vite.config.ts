import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({
    insertTypesEntry: true,
    rollupTypes: true,
    root: path.resolve(__dirname, './'),
    strictOutput: true,
    compilerOptions: {
      declaration: true,
      typeRoots: ['./dist/index.d.ts']
    },
    tsconfigPath: path.resolve(__dirname, './tsconfig.app.json'),
  }), vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.vue', '.ts', '.tsx'],
  },
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, './src/components/index.ts'),
      name: 'ColorPicker',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
});
