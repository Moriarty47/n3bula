import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import cjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';

import { logger } from './util.ts';

import type { RollupOptions } from 'rollup';

export const defineConfig = (options: RollupOptions) => {
  const cwd = process.cwd();
  let packageJson = {} as any;
  try {
    packageJson = JSON.parse(readFileSync(resolve(cwd, 'package.json'), { encoding: 'utf8' }));
  } catch (error: any) {
    logger.error(error);
  }
  const aliasPlugin = packageJson.aliases
    ? [
        alias({
          entries: Object.entries(packageJson.aliases).reduce(
            (obj, [k, v]) => {
              obj[k] = resolve(cwd, v as string);
              return obj;
            },
            {} as Record<string, string>,
          ),
        }),
      ]
    : [];

  const resolvePath = (p: string) => resolve(cwd, p);

  const getInput = () => {
    const input = options.input;
    if (Array.isArray(input)) {
      return input.map(resolvePath);
    } else if (input && typeof input === 'object') {
      return Object.keys(input).reduce(
        (o, k) => {
          o[k] = resolvePath(input[k]);
          return o;
        },
        {} as Record<string, string>,
      );
    }
    return resolvePath(input || 'index.js');
  };

  const config: RollupOptions = {
    input: getInput(),
    output: {
      file: 'dist/index.js',
      sourcemap: false,
      format: 'esm',
      banner: '#!/usr/bin/env node',
      ...options.output,
    },
    plugins: [
      ...aliasPlugin,
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
      ...(options.plugins ? (Array.isArray(options.plugins) ? options.plugins : [options.plugins]) : []),
    ],
  };
  return config;
};
