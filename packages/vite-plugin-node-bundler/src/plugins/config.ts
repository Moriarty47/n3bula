import pathe from 'pathe';
import fs from 'fs/promises';
import { type Format, pathExists, defaultOutputExt } from '../utils';
import type { Plugin } from 'vite';


export function viteNodeConfig(options: {
  entry: string[];
  formats: Format[];
  outDir?: string;
}): Plugin {
  return {
    name: 'vite-node-config',
    apply: 'build',
    async config(config) {
      const root = config.root ?? process.cwd();
      const packageJsonPath = pathe.resolve(root, 'package.json');
      if (!(await pathExists(packageJsonPath))) {
        throw new Error(`Cannot find package.json. ${root}`);
      }
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      return {
        build: {
          outDir: options.outDir,
          target: 'esnext',
          lib: {
            entry: options.entry,
            formats: options.formats,
            fileName(moduleFormat, entryName) {
              const ext = defaultOutputExt({
                format: moduleFormat as Format,
                pkgType: packageJson.type,
              });
              return `${pathe.basename(entryName, pathe.extname(entryName))}${ext.js}`;
            },
          },
        },
        resolve: {
          mainFields: ['module', 'jsnext:main', 'jsnext'],
          conditions: ['node'],
        },
      };
    },
  };
}