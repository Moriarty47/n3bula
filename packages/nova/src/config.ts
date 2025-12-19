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
import { injectEnvPlugin } from './inject-env-plugin';

import { cwd, logger } from './util';

import type { OutputOptions, RollupOptions } from 'rollup';
import type { RequiredNovaInnerOptions, RequiredNovaOptions } from './types';

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

function getReplacePlugin(replaceOptions: RequiredNovaInnerOptions['replace']) {
  const replaceValues = replaceOptions.values;

  return replace({
    preventAssignment: true,
    ...replaceOptions,
    values: (typeof replaceValues === 'function' ? replaceValues(process.env.NOVA_MODE) : replaceValues) || {},
  });
}

function getAliasPlugin(tsconfigPath: string, novaAlias: RequiredNovaInnerOptions['alias']) {
  const aliasEntries = tsconfigPathToAlias(tsconfigPath);
  return aliasEntries ? [alias({ entries: aliasEntries, ...novaAlias })] : [];
}

function getOutputOption(nova: RequiredNovaInnerOptions, rollupOutput: OutputOptions | OutputOptions[] = {}) {
  const mainOutput = [{ format: 'es', file: nova.outputFile }] as OutputOptions[];
  if (!Array.isArray(rollupOutput)) {
    rollupOutput = [rollupOutput];
  }
  const maxLen = Math.max(mainOutput.length, rollupOutput.length);
  for (let i = 0; i < maxLen; i += 1) {
    let o1 = mainOutput[i];
    const o2 = rollupOutput[i] || {};

    if (!o1) {
      o1 = mainOutput[i] = { ...o2 };
    } else {
      Object.assign(o1, o2);
    }

    if (o1.dir) delete o1.file;
    if (!nova.minify) continue;

    if (Array.isArray(o1.plugins)) {
      o1.plugins = [...o1.plugins, terser()].filter(i => !!i);
      continue;
    }
    if (o1.plugins) {
      o1.plugins = [o1.plugins, terser()];
    }
  }

  return mainOutput;
}

function getDtsInputOption(nova: RequiredNovaInnerOptions) {
  let { outputDtsFile } = nova;
  if (typeof outputDtsFile === 'string') outputDtsFile = [outputDtsFile];
  return outputDtsFile;
}

export const defineConfig = (options: RequiredNovaOptions, envPath: string) => {
  const { nova, output: optionOutput, ...rollupOptions } = options;

  const entryId = resolve(cwd, nova.input);

  const commonPlugins = [
    ...getAliasPlugin(nova.tsconfigPath, nova.alias),
    nodeResolve({ extensions: ['.js', '.ts'], ...nova.nodeResolve }),
    nodeExternals(nova.externals),
    json(nova.json),
    cjs({ exclude: ['node_moduels/*'], ...nova.cjs }),
  ];

  const output = getOutputOption(nova, optionOutput);

  const dtsInput = getDtsInputOption(nova);

  const plugins = options.plugins ? (Array.isArray(options.plugins) ? options.plugins : [options.plugins]) : [];

  const config: RollupOptions[] = [
    {
      input: entryId,
      output,
      ...rollupOptions,
      plugins: [
        emptyDirs({ dirs: 'dist' }),
        ...commonPlugins,
        getReplacePlugin(nova.replace),
        typescript(),
        injectEnvPlugin(entryId, envPath),
        ...plugins,
      ],
    },
    {
      ...rollupOptions,
      input: dtsInput,
      output,
      plugins: [...commonPlugins, dts(nova.dts)],
    } as RollupOptions,
  ];
  return config;
};
