import type { Plugin } from 'vite';
import { viteNodeExternals } from './plugins/externals';
import { viteNodeConfig } from './plugins/config';

export type VitePluginNodeBundlerOptions = {
  entry?: string | string[];
  formats?: ('es' | 'cjs')[];
  cjsEnv?: boolean;
  dts?: boolean | { bundle?: boolean; };
  outDir?: string;
};

export async function vitePluginNodeBundler(options?: VitePluginNodeBundlerOptions): Promise<Plugin[]> {
  const entry = options?.entry
    ? Array.isArray(options?.entry)
      ? options.entry
      : [options.entry]
    : ['src/index.ts'];

  const plugins: Plugin[] = [
    viteNodeExternals(),
    viteNodeConfig({
      entry,
      formats: options?.formats ?? ['es'],
      outDir: options?.outDir,
    }),
  ];

  if (options?.cjsEnv) {
    plugins.push((await import('./plugins/cjs-env')).viteCjsEnv());
  }

  if (options?.dts) {
    plugins.push(
      ...((await import('./plugins/dts')).viteDts({
        ...(typeof options.dts === 'object' ? options.dts : {}),
        entry,
      }))
    );
  }

  return plugins;
}