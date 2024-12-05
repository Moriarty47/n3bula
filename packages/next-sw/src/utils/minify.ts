import { dynamic } from './dynamic';
import { NAME } from './helper';

import type { WebpackCompiler } from '../types';

const swc = dynamic('next/dist/build/swc');

interface MinifyResult { code: string }
type MinifyFunction = (source: string, options: Record<string, unknown>) => MinifyResult;

const minify: MinifyFunction = swc.minifySync;

/** Simple SWC minifier */
export default function ServiceWorkerMinify(this: WebpackCompiler, compiler: WebpackCompiler) {
  compiler.hooks.compilation.tap(NAME, (compilation) => {
    const hooks = compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation);

    hooks.chunkHash.tap(NAME, (_, hash) => {
      hash.update(NAME);
    });

    compilation.hooks.processAssets.tap({
      additionalAssets: true,
      name: NAME,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
    }, (assets) => {
      Object.keys(assets).forEach((assetName) => {
        const asset = compilation.getAsset(assetName)!;

        if (asset.info.minimized) return;

        const result = minify(asset.source.source().toString(), {
          compress: true,
          mangle: true,
        });

        const source = new compiler.webpack.sources.RawSource(result.code, true);

        compilation.updateAsset(assetName, source, {
          minimized: true,
        });
      });
    });
  });
}
