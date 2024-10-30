import { nodeExternals } from 'rollup-plugin-node-externals';
import type { Plugin } from 'vite';

export function viteNodeExternals(): Plugin {
  return {
    ...nodeExternals(),
    name: 'vite-node-externals',
    apply: 'build',
    enforce: 'pre',
  }
}