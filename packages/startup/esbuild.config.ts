import { build } from 'esbuild';
import nodeExternals from 'esbuild-plugin-node-externals';

build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'esm',
  minify: true,
  outfile: 'lib/index.js',
  platform: 'node',
  plugins: [nodeExternals()],
}).catch(error => {
  console.error(error);
  process.exit(1);
});
