import { build } from 'esbuild';
import nodeExternals from 'esbuild-plugin-node-externals';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'lib/index.js',
  format: 'esm',
  platform: 'node',
  minify: true,
  plugins: [nodeExternals()],
}).catch(error => {
  console.error(error);
  process.exit(1);
});
