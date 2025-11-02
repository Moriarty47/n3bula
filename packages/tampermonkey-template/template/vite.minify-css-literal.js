import { readFileSync } from 'fs';
import { compileString } from 'sass';
/**
 * @return {import('vite').Plugin}
 */
export default function minifyCssPlugin() {
  return {
    name: 'vite-minify-css',
    enforce: 'pre',
    transform(_code, id) {
      if (id.endsWith('scss?raw')) {
        const code = readFileSync(id.slice(0, -4), { encoding: 'utf8' });
        return {
          code: `export default "${compileString(code, { style: 'compressed' }).css}"`,
          map: null,
        };
      }
    }
  };
};