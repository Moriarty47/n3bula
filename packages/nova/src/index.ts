import { join, resolve, relative } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { rollup, RollupBuild, RollupOptions } from 'rollup';

import { defineNova } from './nova.ts';
import { defineConfig } from './config.ts';

import { logger, mergeDefaultNovaConfig } from './util.ts';

import type { NovaOptions, RequiredNovaOptions } from './nova.ts';
import { stat } from 'node:fs/promises';

export type { NovaOptions };

const cwd = process.cwd();
const argv = process.argv.slice(2);

try {
  const config = await getConfig();
  if (!argv.length || argv[0] === 'dev') {
    // nova [=dev]
    defineNova(config);
  } else if (argv[0] === 'build') {
    // nova build
    await build(config);
  }
} catch (error) {
  logger.error(error);
}

async function build(config: RequiredNovaOptions) {
  let bundle: RollupBuild | null = null;
  let bundleFailed = false;
  try {
    const rollupCfg = defineConfig(config);
    bundle = await rollup(rollupCfg);

    await generateOutputs(bundle, rollupCfg);
  } catch (error: any) {
    bundleFailed = true;
    logger.error(error);
  }
  if (bundle) {
    await bundle.close();
  }
  process.exit(bundleFailed ? 1 : 0);
}

async function generateOutputs(bundle: RollupBuild, rollupCfg: RollupOptions) {
  let { output: outputOptionsList } = rollupCfg;
  if (!outputOptionsList) throw new Error('should specify [output]');

  if (!Array.isArray(outputOptionsList)) {
    outputOptionsList = [outputOptionsList];
  }

  const statInfos = [];
  let maxSizeLength = 0;
  for (const outputOptions of outputOptionsList) {
    const { output } = await bundle.write(outputOptions);
    for (const file of output) {
      if (file.type === 'chunk' && file.facadeModuleId) {
        let outputPath;
        if (outputOptions.dir) {
          outputPath = join(outputOptions.dir, file.fileName);
        } else {
          outputPath = join(cwd, outputOptions.file!);
        }
        const fileStat = await stat(outputPath);
        const size = `${(fileStat.size / 1024).toFixed(2)}KB`;
        if (size.length > maxSizeLength) maxSizeLength = size.length;
        statInfos.push([size, relative(cwd, outputPath)]);
      }
    }
  }
  statInfos.forEach(([size, p], i) => {
    logger[i === 0 ? 'info' : 'info2'](`\x1b[36m${size.padStart(maxSizeLength, ' ')}\x1b[m`, p);
  });
  console.log();
}

async function getConfig() {
  const cwd = process.cwd();
  const configPaths = ['ts', 'mjs', 'cjs', 'js'].map(ext => resolve(cwd, `nova.config.${ext}`));
  const configPath = configPaths.find(cfg => existsSync(cfg));

  const config: RequiredNovaOptions = configPath ? (await import(pathToFileURL(configPath).href)).default : {};

  config.nova = mergeDefaultNovaConfig(config.nova);

  return config;
}
