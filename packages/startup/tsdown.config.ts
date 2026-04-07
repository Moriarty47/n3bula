import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  // minify: true,
  outDir: 'lib',
  platform: 'node',
});
