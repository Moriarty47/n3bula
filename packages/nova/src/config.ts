import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { parse } from 'jsonc-parser';
import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import cjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';
import { emptyDirs } from '../rollup.plugin.empty-dir';

import { cwd, cwdRelative, logger } from './util';

import type { RollupOptions } from 'rollup';
import type { RequiredNovaOptions } from './types';

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

export const defineConfig = (options: RequiredNovaOptions, envPath: string) => {
  const { nova, output: optionOutput, ...rollupOptions } = options;
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
    ...(optionOutput || {}),
  };
  if ((mainOutput as any).dir) {
    delete (mainOutput as any).file;
  }

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

  const entryId = resolvePath(nova.input);

  const plugins = options.plugins ? (Array.isArray(options.plugins) ? options.plugins : [options.plugins]) : [];

  const replaceValues = nova.replace.values;

  const config: RollupOptions[] = [
    {
      input: entryId,
      output,
      ...rollupOptions,
      plugins: [
        emptyDirs({ dirs: 'dist' }),
        ...commonPlugins,
        replace({
          preventAssignment: true,
          ...nova.replace,
          values: typeof replaceValues === 'function' ? replaceValues(process.env.NOVA_MODE) : replaceValues,
        }),
        typescript(),
        {
          name: 'inject-env-loader',
          generateBundle(_options, bundle) {
            if (!envPath) return;

            for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
              if (chunkOrAsset.type !== 'chunk') continue;
              const chunk = chunkOrAsset;
              if (!chunk.modules || !Object.keys(chunk.modules).some(id => id === entryId)) continue;

              const code = chunk.code;
              const importRegex =
                /import([ \n\t]*(?:[^ \n\t\{\}]+[ \n\t]*,?)?(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)from[ \n\t]*(['"])([^'"\n]+)(?:['"])/g;
              let lastMatchIndex = -1;
              let m;
              while ((m = importRegex.exec(code)) !== null) {
                lastMatchIndex = m.index + m[0].length;
              }

              const appendCode = `import { config as dotEnvCfg } from 'dotenv';\ndotEnvCfg({ quiet: true, path: ${JSON.stringify(cwdRelative(envPath))} });`;
              let newCode;
              if (lastMatchIndex >= 0) {
                newCode = code.slice(0, lastMatchIndex) + '\n' + appendCode + '\n' + code.slice(lastMatchIndex);
              } else {
                newCode = code + '\n' + appendCode;
              }

              // 用修改后的代码替换 chunk.code
              chunk.code = newCode;
            }
          },
        },
        ...plugins,
      ],
    },
    {
      input: entryId,
      output: {
        file: nova.outputDtsFile,
        format: 'es',
      },
      ...rollupOptions,
      plugins: [...commonPlugins, dts(nova.dts)],
    } as RollupOptions,
  ];
  return config;
};
