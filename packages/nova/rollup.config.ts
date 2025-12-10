import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';
import cjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import { emptyDirs } from './rollup.plugin.empty-dir.ts';
import { nodeExternals } from 'rollup-plugin-node-externals';

import type { RollupOptions } from 'rollup';

const isDev = process.env.NODE_ENV === 'development';

const config: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      inlineDynamicImports: true,
      banner: '#!/usr/bin/env node',
    },
    plugins: [
      emptyDirs({
        dirs: 'dist',
      }),
      nodeResolve(),
      nodeExternals(),
      json(),
      cjs({
        exclude: ['node_moduels/*'],
      }),
      esbuild({
        target: 'esnext',
        sourceMap: false,
        minify: false,
      }),
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
