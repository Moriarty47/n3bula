import pathe from 'pathe';
import fs from 'fs/promises';
import dts from 'vite-plugin-dts';
import { type IConfigFile, ExtractorConfig, ExtractorResult, Extractor } from '@microsoft/api-extractor';
import type { Plugin, ResolvedConfig } from 'vite';

export function viteDts(options: {
  bundle?: boolean;
  entry: string[];
  outDir?: string;
}): Plugin[] {
  if (!options.bundle) return [dts()];

  let config: ResolvedConfig;

  return [
    {
      name: 'vite-dts-bundle',
      configResolved(_config) {
        config = _config;
      },
    },
    dts({
      outDir: pathe.join(options.outDir ?? 'dist', 'types'),
      async afterBuild() {
        const outDir = options.outDir
          ? pathe.isAbsolute(options.outDir)
            ? options.outDir
            : pathe.resolve(config.root, options.outDir)
          : pathe.resolve(config.root, 'dist');
        await Promise.all(
          options.entry.map(async (it) => {
            const fileName = `${pathe.basename(it, pathe.extname(it))}.d.ts`;
            await dtsBundle({
              entry: pathe.resolve(outDir, 'types', fileName),
              outFile: pathe.resolve(outDir, fileName),
            });
          }),
        );
        await fs.rm(pathe.resolve(outDir, 'types'), {
          force: true, recursive: true
        });
      }
    }),
  ];
}

async function dtsBundle(options: {
  entry: string;
  outFile: string;
}) {
  const configPath = pathe.resolve(options.entry + '.json');
  await fs.writeFile(configPath, JSON.stringify({
    $schema: 'https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json',
    mainEntryPointFilePath: options.entry,
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: options.outFile,
    },
    tsdocMetadata: { enabled: false },
    apiReport: { enabled: false },
    docModel: { enabled: false },
  } as IConfigFile), 'utf-8');

  const extractorConfig = ExtractorConfig.loadFileAndPrepare(configPath);
  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: false,
    showDiagnostics: false,
  });

  if (!extractorResult.succeeded) {
    throw new Error(`API Extractor failed to extract types.\n
      Completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings.`);
  }
}