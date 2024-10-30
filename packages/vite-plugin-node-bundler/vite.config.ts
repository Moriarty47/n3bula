import { defineConfig } from 'vite';
import { vitePluginNodeBundler } from './src';

export default defineConfig({
  plugins: [vitePluginNodeBundler({
    dts: { bundle: true },
  })]
});