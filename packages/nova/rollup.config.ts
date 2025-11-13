import json from '@rollup/plugin-json';
import cjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';
import copyLoaderPlugin from './rollup-plugin-copy-loader.ts';

import type { RollupOptions } from 'rollup';

const isDev = process.env.NODE_ENV === 'development';

const config: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      sourcemap: false,
      format: 'esm',
      banner: '#!/usr/bin/env node',
    },
    plugins: [
      nodeResolve(),
      nodeExternals(),
      json(),
      cjs({
        exclude: ['node_moduels/*'],
      }),
      esbuild({
        target: 'esnext',
        sourceMap: false,
        minify: true,
      }),
      copyLoaderPlugin(),
    ],
  },
  ...(isDev
    ? []
    : [
        {
          input: 'src/index.ts',
          output: {
            file: 'dist/index.d.ts',
            format: 'es',
          },
          plugins: [dts()],
        } as RollupOptions,
      ]),
];

export default config;
