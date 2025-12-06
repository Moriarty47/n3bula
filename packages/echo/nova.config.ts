// import { dts } from 'rollup-plugin-dts';
import type { NovaOptions } from '@n3bula/nova';

const config: NovaOptions = {
  nova: {
    watchPaths: ['./src/common', './src/node'],
    input: './src/node/index.ts',
    outputFile: 'dist/node.js',
    tsconfigPath: './tsconfig.node.json'
  },
};

export default config;
