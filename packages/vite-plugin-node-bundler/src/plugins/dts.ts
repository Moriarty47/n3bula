import pathe from 'pathe';
import dts from 'vite-plugin-dts';
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
      insertTypesEntry: true,
      rollupTypes: true,
      strictOutput: true,
      outDir: pathe.join(options.outDir ?? 'dist'),
      exclude: ['test'],
    }),
  ];
}