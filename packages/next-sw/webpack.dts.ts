import {
  lstat,
  readdir,
  rm,
  rmdir,
} from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { cwd } from 'node:process';

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

import type {
  ExtractorLogLevel,
  IConfigApiReport,
  IConfigDocModel,
  IConfigTsdocMetadata,
  IExtractorConfigPrepareOptions,
  IExtractorMessagesConfig,
} from '@microsoft/api-extractor';
import type { Compiler } from 'webpack';

export interface DtsPluginOptions {
  entry?: string | Record<string, string>;
  root?: string;
  outDir?: string;
  filename?: string;
  libFolder?: string;
  compilerOptions?: Record<string, any>;
  apiReport?: Omit<IConfigApiReport, 'enabled'>;
  docModel?: Omit<IConfigDocModel, 'enabled'>;
  tsdocMetadata?: Omit<IConfigTsdocMetadata, 'enabled'>;
  messages?: Omit<IExtractorMessagesConfig, 'enabled'>;
  ignores?: string[];
}

interface DtsPluginOptionsEntry extends Required<DtsPluginOptions> {
  entry: string;
}

const TAG = '\x1B[33m[Dts]\x1B[m ';

export default class Dts {
  static DtsPluginName = 'DtsPlugin';
  entries: string[] = [];
  outDir!: string;

  constructor(public options: DtsPluginOptions = {}) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapAsync(Dts.DtsPluginName, async (compilation, callback) => {
      this.outDir = compilation.options.output.path!;
      if (!this.outDir) {
        console.warn(`${TAG}No output path specified, defaulting to \'./dist\'`);
        this.outDir = resolve(__dirname, './dist');
      }

      const entry = this.options.entry;
      const root = cwd();

      if (typeof this.options.outDir === 'undefined') {
        this.options.outDir = this.outDir;
      }

      if (typeof entry === 'undefined') {
        console.error(new TypeError(`${TAG}options.entry is required`).message);
        callback();
        return;
      }

      const options: DtsPluginOptionsEntry[] = [];
      if (typeof entry === 'string') {
        const _entry = normalizeEntry(entry);
        this.entries.push(_entry);
        options.push({
          root,
          ...this.options,
          entry: _entry,
        } as DtsPluginOptionsEntry);
      } else {
        Object.keys(entry).forEach((key) => {
          const _entry = normalizeEntry(entry[key]);
          this.entries.push(_entry);
          options.push({
            root,
            ...this.options,
            entry: normalizeEntry(_entry),
            filename: key,
          } as DtsPluginOptionsEntry);
        });
      }

      extractDts(options);

      callback();
    });

    compiler.hooks.afterDone.tap(Dts.DtsPluginName, async () => {
      try {
        const dir = (await readdir(this.outDir, { recursive: true })).map(p => resolve(this.outDir, p));
        const ignores = this.options.ignores || [];

        for (let i = 0, len = dir.length; i < len; i += 1) {
          const p = dir[i];
          if (this.entries.includes(p) || ignores.includes(p)) {
            dir.splice(i, 1);
            len -= 1;
            i -= 1;
          } else {
            const stat = await lstat(p);
            if (stat.isDirectory()) continue;
            if (!p.endsWith('.d.ts')) continue;
            await rm(p, { force: true });
            dir.splice(i, 1);
            len -= 1;
            i -= 1;
          }
        }

        await removeEmptyDirectories(this.outDir);
      } catch (error: any) {
        console.error(error.message);
        process.exit(1);
      }
    });
  }
}

function extractDts(options: DtsPluginOptionsEntry[]) {
  const res = options
    .map((option) => {
      const extractorConfig = ExtractorConfig.prepare(createExtractorPrepareOptions(option));
      return Extractor.invoke(extractorConfig, {
        localBuild: true,
        showDiagnostics: false,
        showVerboseMessages: false,
        typescriptCompilerFolder: option.libFolder,
      });
    });

  if (res.every(r => r.succeeded)) {
    console.log(`${TAG}API Extractor completed successfully`);
  } else {
    res.forEach((result) => {
      if (!result.succeeded) {
        console.error(`${TAG}API Extractor completed with ${result.errorCount} errors and ${result.warningCount} warnings`);
      }
    });
  }
}

async function removeEmptyDirectories(dir: string) {
  const stas = await lstat(dir);
  if (!stas.isDirectory()) return;

  let filenames = await readdir(dir);
  if (filenames.length > 0) {
    const recursiveRemovalPromises = filenames.map(filename => removeEmptyDirectories(resolve(dir, filename)));
    await Promise.all(recursiveRemovalPromises);
    filenames = await readdir(dir);
  }

  if (filenames.length === 0) {
    console.info('Removing empty directory: ', dir);
    await rmdir(dir);
  }
}

function normalizeEntry(entry: string) {
  const ext = extname(entry);
  return entry.endsWith('.d.ts') ? entry : `${entry.replace(ext, '')}.d.ts`;
}

const EMPTY_OBJECT = {};

function createExtractorPrepareOptions({
  root,
  entry,
  outDir,
  filename,
  compilerOptions = EMPTY_OBJECT,
  apiReport = EMPTY_OBJECT,
  docModel = EMPTY_OBJECT,
  tsdocMetadata = EMPTY_OBJECT,
  messages = EMPTY_OBJECT,
}: DtsPluginOptionsEntry): IExtractorConfigPrepareOptions {
  if (/preserve/i.test(compilerOptions.module)) {
    compilerOptions = { ...compilerOptions, module: 'ESNext' };
  }
  const configObjectFullPath = resolve(root, 'api-extractor.json');

  if (!/\.d\.(?:m|c)?tsx?$/.test(filename)) {
    filename += '.d.ts';
  }

  return {
    configObject: {
      projectFolder: root,
      mainEntryPointFilePath: entry,
      compiler: {
        tsconfigFilePath: resolve(root, 'tsconfig.json'),
        overrideTsconfig: {
          $schema: 'https://json.schemastore.org/tsconfig',
          compilerOptions,
        },
      },
      apiReport: { enabled: false, ...apiReport },
      docModel: { enabled: false, ...docModel },
      dtsRollup: {
        enabled: true,
        publicTrimmedFilePath: resolve(outDir, filename),
      },
      tsdocMetadata: { enabled: false, ...tsdocMetadata },
      messages: {
        compilerMessageReporting: {
          default: {
            logLevel: 'none' as ExtractorLogLevel.None,
          },
        },
        extractorMessageReporting: {
          default: {
            logLevel: 'none' as ExtractorLogLevel.None,
          },
        },
        ...messages,
      },
    },
    configObjectFullPath,
    packageJsonFullPath: resolve(root, 'package.json'),
  };
}
