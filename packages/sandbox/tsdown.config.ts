import { defineConfig } from 'tsdown';

export default defineConfig({
  copy: [
    {
      from: './src/types.d.ts',
      verbose: true,
    },
  ],
  entry: ['./src/index.ts'],
});
