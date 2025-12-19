import { join } from 'node:path';
import { stat } from 'node:fs/promises';

import { cwd, cwdRelative, dynamicImport, logger, useDotEnv } from './util';

import type { RollupBuild, RollupOptions } from 'rollup';
import type { RequiredNovaOptions } from './types';

export async function novaBuild(config: RequiredNovaOptions, envPath: string) {
  const { processEnv } = useDotEnv(envPath);

  process.env = { ...processEnv };

  const [{ rollup }, { defineConfig }] = await dynamicImport(
    () => import('rollup'),
    () => import('./config'),
  );

  let bundle: RollupBuild | null = null;
  let bundleFailed = false;
  const rollupCfg = defineConfig(config, envPath);

  for (const cfg of rollupCfg) {
    try {
      bundle = await rollup(cfg);

      await generateOutputs(bundle, cfg);
    } catch (error: any) {
      bundleFailed = true;
      logger.error('build', error);
    }
    if (bundle) {
      await bundle.close();
    }
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
        statInfos.push([size, cwdRelative(outputPath)]);
      }
    }
  }
  statInfos.forEach(([size, p], i) => {
    logger[i === 0 ? 'info' : 'info2'](`\x1b[36m${size.padStart(maxSizeLength, ' ')}\x1b[m`, p);
  });
  console.log();
}
