import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { parse } from 'jsonc-parser';
import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import cjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import esbuild from 'rollup-plugin-esbuild';
import replace from '@rollup/plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';

import { cwd, logger } from './util.ts';

import type { RollupOptions } from 'rollup';
import type { RequiredNovaOptions } from './types.ts';

function tsconfigPathToAlias(tsconfigPath: string) {
  let tsconfig = {} as any;
  try {
    tsconfig = parse(readFileSync(tsconfigPath, 'utf8'));
  } catch (error: any) {
    logger.error('tsconfigPathToAlias', error);
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
  const { nova } = options;
  const aliasEntries = tsconfigPathToAlias(nova.tsconfigPath);
  const aliasPlugin = aliasEntries
    ? [
        alias({
          entries: aliasEntries,
          ...nova.alias,
        }),
      ]
    : [];

  const resolvePath = (p: string) => resolve(cwd, p);

  const commonPlugins = [
    ...aliasPlugin,
    nodeResolve({
      extensions: ['.js', '.ts'],
      ...nova.nodeResolve,
    }),
    nodeExternals(nova.externals),
    json(nova.json),
    cjs({
      exclude: ['node_moduels/*'],
      ...nova.cjs,
    }),
  ];

  const mainOutput = {
    file: nova.outputFile,
    format: 'es',
    ...options.output,
  };

  const output = (
    nova.minify === 'both'
      ? [
          mainOutput,
          {
            ...mainOutput,
            file: nova.outputFile.replace(/\.js$/, $0 => `.min${$0}`),
            plugins: [terser()],
          },
        ]
      : {
          ...mainOutput,
          ...(nova.minify
            ? {
                plugins: [terser()],
              }
            : {}),
        }
  ) as RollupOptions['output'];

  const config: RollupOptions[] = [
    {
      input: resolvePath(nova.input),
      output,
      plugins: [
        ...commonPlugins,
        replace({
          preventAssignment: true,
          values: {
            'process.env.DEV': JSON.stringify(process.env.DEV || 'false'),
          },
          ...nova.replace,
        }),
        esbuild({
          target: 'esnext',
          sourceMap: false,
          minify: false,
          ...nova.esbuild,
        }),
        ...(options.plugins ? (Array.isArray(options.plugins) ? options.plugins : [options.plugins]) : []),
      ],
    },
    {
      input: resolvePath(nova.input),
      output: {
        file: nova.outputDtsFile,
        format: 'es',
      },
      plugins: [...commonPlugins, dts(nova.dts)],
    } as RollupOptions,
  ];
  return config;
};
