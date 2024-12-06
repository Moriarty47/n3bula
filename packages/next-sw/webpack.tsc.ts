import { existsSync } from 'node:fs';
import {
  basename,
  dirname,
  join,
  resolve,
} from 'node:path';
import { cwd } from 'node:process';

import { minify } from 'terser';
import * as ts from 'typescript';
import {
  Compilation,
  type Compiler,
  sources,
} from 'webpack';

import type { CompilerOptions } from 'typescript';

const { RawSource } = sources;

const TAG = '\x1B[33m[Tsc]\x1B[m ';

interface tsOptions {
  compilerOptions: CompilerOptions;
  [key: string]: any;
}
interface TscPluginOptions {
  entry: string | string[];
  tsConfig: string | tsOptions;
}

export default class Tsc {
  static TscPluginName = 'TscPlugin';
  entries: string[] = [];
  outDir!: string;

  constructor(public options: TscPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(Tsc.TscPluginName, (compilation) => {
      this.outDir = compilation.options.output.path!;

      compilation.hooks.processAssets.tapAsync({
        name: Tsc.TscPluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
      }, async (assets, callback) => {
        if (!this.outDir) {
          console.warn(`${TAG}No output path specified, defaulting to \'./dist\'`);
          this.outDir = resolve(__dirname, './dist');
        }

        const entry = this.options.entry;

        if (!entry) {
          console.warn(`${TAG}No entry specified. Skipping...`);
          callback();
          return;
        }

        // Loading ts config
        let tsConfig = this.options.tsConfig || resolve(cwd(), 'tsconfig.json');
        if (typeof tsConfig === 'string') {
          if (!existsSync(tsConfig)) {
            console.error(`${TAG}tsconfig.json not found at ${tsConfig}`);
            callback();
            return;
          }
          const _tsConfig = ts.readConfigFile(tsConfig, ts.sys.readFile);
          if (_tsConfig.error) {
            console.error(`${TAG}Failed to read tsconfig.json: ${_tsConfig.error.messageText}`);
            callback();
            return;
          }
          tsConfig = _tsConfig.config as tsOptions;
        } else if (tsConfig === null || tsConfig === undefined) {
          console.error(`${TAG}tsConfig cannot be nullable`);
          callback();
          return;
        }

        const entries: string[] = typeof entry === 'string' ? [entry] : entry;

        const commandLine = ts.parseJsonConfigFileContent({
          ...tsConfig,
          compilerOptions: {
            target: ts.ScriptTarget.ES2015,
            module: ts.ModuleKind.CommonJS,
            lib: ['ES2015'],
            moduleResolution: ts.ModuleResolutionKind.Node10,
            esModuleInterop: true,
            allowUmdGlobalAccess: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            skipLibCheck: true,
            isolatedModules: true,
            declaration: true,
            ...tsConfig.compilerOptions,
            exclude: ['node_modules'],
          },
        }, ts.sys, dirname(this.outDir));

        // Create a Program with an in-memory emit
        const { createdFiles, host } = createHost(commandLine.options);

        const emitResult = compile(entries, commandLine.options, host);

        if (emitResult.emitSkipped) {
          console.error(`${TAG}Files compiled failed`);
          callback();
          return;
        }

        const outputPaths = entries.map(file => join(this.outDir, basename(file)));

        for (let i = 0, len = outputPaths.length; i < len; i += 1) {
          const filePath = outputPaths[i];

          const jsPath = filePath.replace(/\.(j|t)s$/, '.js');
          const dtsPath = jsPath.replace(/\.js$/, '.d.ts');

          const jsContent = await compressCode(createdFiles[jsPath]);
          const dtsContent = createdFiles[dtsPath];

          compilation.emitAsset(basename(jsPath), new RawSource(jsContent));
          compilation.emitAsset(basename(dtsPath), new RawSource(dtsContent));
        }

        console.info(`${TAG}Files compiled successfully`);
        callback();
      });
    });
  }
}

function compile(
  fileNames: string[],
  options: ts.CompilerOptions,
  host?: ts.CompilerHost,
  diagnostic: boolean = false,
): ts.EmitResult {
  // Compile
  const program = ts.createProgram(fileNames, options, host);
  const emitResult = program.emit();

  if (!diagnostic) return emitResult;

  ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)
    .forEach((diagnostic) => {
      if (diagnostic.file && diagnostic.start) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.error(`${TAG}${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.error(`${TAG}${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
      }
    });

  return emitResult;
}

function createHost(options: ts.CompilerOptions) {
  const { declaration } = options;
  // Create a Program with an in-memory emit
  const host = ts.createCompilerHost(options);
  const createdFiles = {} as Record<string, any>;

  if (!declaration) return { createdFiles, host };

  host.writeFile = (fileName: string, contents: string) => createdFiles[fileName] = contents;

  return { createdFiles, host };
}

async function compressCode(code: string) {
  try {
    const result = (await minify(code, { compress: true, mangle: true })).code;
    return result || code;
  } catch (error: any) {
    console.error(`${TAG}Code compression failed: `, error.message);
    return code;
  }
}
