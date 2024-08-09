import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const entryInputs = fs.readdirSync(path.resolve(__dirname, './src/transform'))
  .filter(fileName => !fileName.includes('.test.'))
  .reduce((inputs, fileName) => {
    inputs[fileName.replace('.ts', '')] = path.resolve(__dirname, `./src/transform/${fileName}`);
    return inputs;
  }, {} as Record<string, string>);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      exclude: ['test/**/*.ts', 'src/**/*.test.ts', 'vite-env.d.ts'],
      copyDtsFiles: true,
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
    lib: {
      entry: path.resolve(__dirname, './dist/index.js'),
      name: 'Colors',
      fileName: (_, entryName) => `${entryName}.js`,
      formats: ['es']
    },
    rollupOptions: {
      input: {
        ...entryInputs,
        index: path.resolve(__dirname, './src/index.ts'),
      },
      output: {
        format: 'esm',
        inlineDynamicImports: false,
      }
    }
  }
});
