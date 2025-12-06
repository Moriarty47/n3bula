import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { parse } from 'jsonc-parser';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import cjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';

import { cwd, logger } from './util.ts';

import type { RollupOptions } from 'rollup';
import type { RequiredNovaOptions } from './nova.ts';

function tsconfigPathToAlias(tsconfigPath: string) {
  let tsconfig = {} as any;
  try {
    tsconfig = parse(readFileSync(tsconfigPath, 'utf8'));
  } catch (error: any) {
    logger.error(error);
    return null;
  }
  const { baseUrl = '.', paths = {} } = tsconfig.compilerOptions || {};
  const absBaseUrl = resolve(dirname(tsconfigPath), baseUrl);

  const entries = Object.keys(paths).map(key => {
    const targets = paths[key]; // array
    // handle wildcard
    if (key.endsWith('/*')) {
      const find = key.replace(/\/\*$/, '');
      // pick first target and remove trailing /*
      const target = targets[0].replace(/\/\*$/, '');
      const replacement = resolve(absBaseUrl, target);
      return { find, replacement };
    } else {
      const find = key;
      const target = targets[0];
      const replacement = resolve(absBaseUrl, target);
      return { find, replacement };
    }
  });

  return entries;
}

export const defineConfig = (options: RequiredNovaOptions) => {
  const aliasEntries = tsconfigPathToAlias(options.nova.tsconfigPath);
  const aliasPlugin = aliasEntries
    ? [
        alias({
          entries: aliasEntries,
        }),
      ]
    : [];

  const resolvePath = (p: string) => resolve(cwd, p);

  const config: RollupOptions[] = [
    {
      input: resolvePath(options.nova.input),
      output: {
        file: options.nova.outputFile,
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
    },
    {
      input: resolvePath(options.nova.input),
      output: {
        file: options.nova.outputDtsFile,
        format: 'es',
      },
      plugins: [dts()],
    } as RollupOptions,
  ];
  return config;
};
