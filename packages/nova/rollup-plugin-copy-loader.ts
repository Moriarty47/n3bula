import { mkdir } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';

import esbuild from 'esbuild';
import { globby } from 'globby';

import type { Plugin } from 'rollup';

export default function copyAndMinifyPlugin(): Plugin {
  const cwd = process.cwd();

  return {
    name: 'copy-and-loader',
    async generateBundle(outputOptions, bundle, isWrite) {
      const outDir = outputOptions.dir || dirname(outputOptions.file || 'dist');

      const paths = await (
        await globby('loaders/*.js', { dot: true })
      ).map(p => {
        const rel = relative(cwd, p);
        return { src: rel, out: join(outDir, rel) };
      });

      await mkdir(outDir, { recursive: true });

      for (const p of paths) {
        await esbuild.build({
          entryPoints: [p.src],
          target: 'esnext',
          minify: true,
          outfile: p.out,
        });
      }
    },
  };
}
