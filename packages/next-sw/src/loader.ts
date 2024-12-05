import { dynamic } from './utils/dynamic';

import type { WebpackLoaderContext } from './types';

const swc = dynamic('next/dist/build/swc');

export default function ServiceWorkerLoader(this: WebpackLoaderContext<{
  minify: boolean;
  defines: Record<string, string>;
}>, source: string): string {
  const options = this.getOptions();

  return swc.transformSync(source, {
    isModule: true,
    jsc: {
      externalHelpers: false,
      loose: true,
      parser: { syntax: 'typescript' },
      target: 'es2015',
      transform: {
        optimizer: {
          globals: {
            typeofs: {
              document: 'undefined',
              window: 'undefined',
            },
            vars: options.defines,
          },
        },
      },
    },
    minify: options.minify,
    module: { type: 'es6' },
    sourceMaps: false,
  }).code.toString();
}
