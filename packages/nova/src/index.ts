import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { rollup, RollupBuild, RollupOptions } from 'rollup';

import { defineNova } from './nova.ts';
import { defineConfig } from './config.ts';

import { logger } from './util.ts';

import type { NovaOptions } from './nova.ts';

export type { NovaOptions };

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

async function build(config: NovaOptions) {
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

  for (const outputOptions of outputOptionsList) {
    await bundle.write(outputOptions);
  }
}

async function getConfig() {
  const cwd = process.cwd();
  const configPaths = ['ts', 'mjs', 'cjs', 'js'].map(ext => resolve(cwd, `nova.config.${ext}`));
  const configPath = configPaths.find(cfg => existsSync(cfg));
  return (configPath ? (await import(pathToFileURL(configPath).href)).default : {}) as NovaOptions;
}
