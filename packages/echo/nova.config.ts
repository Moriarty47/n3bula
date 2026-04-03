// import { dts } from 'rollup-plugin-dts';
import type { NovaOptions } from '@n3bula/nova';

const config: NovaOptions = {
  nova: {
    input: './src/node/test.ts',
    tsconfigPath: './tsconfig.node.json',
    watchPaths: ['./src/common', './src/node'],
  },
};

export default config;
