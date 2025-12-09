import { cwd } from 'node:process';
import { posix, relative, resolve, sep } from 'node:path';

import { globby } from 'globby';
import { pathToFileURL } from 'node:url';

type Pattern = string | readonly string[];
type MapKey = (filePath: string) => string;

const getCode = async (pattern: Pattern, dir: string, mapKey: MapKey, isDevMode = false) => {
  const entries = await globby(pattern, {
    onlyFiles: true,
    cwd: dir,
  });

  const imports = entries.map(entry => {
    const tempPath = './' + posix.join(relative(cwd(), dir).split(sep).join(posix.sep), entry);
    const filePath = isDevMode ? pathToFileURL(tempPath).href : tempPath;
    const key = mapKey(entry.replace(/\\/g, '/'));
    return `  '${key}': () => import(${JSON.stringify(filePath)})`;
  });

  const code = `export const apis = {
${imports.join(',\n')}
};`;

  return code;
};

export const loader = {} as {
  getCode: () => Promise<string>;
};

export function virtualApiResolver(options: { dir: string; pattern?: Pattern; mapKey?: MapKey }) {
  const defaultApisPaths = resolve(cwd(), 'src/apis');

  let { dir = defaultApisPaths, pattern = '**/*.ts', mapKey = p => p } = options;

  const id = 'virtual:api-resolver';
  const virtualId = '\0' + id;

  loader.getCode = () => getCode(pattern, dir, mapKey, true);

  return {
    name: id,
    resolveId(source: string) {
      if (source === id) return virtualId;
      return null;
    },
    async load(id: string) {
      if (id !== virtualId) return null;

      const code = await getCode(pattern, dir, mapKey);

      return code;
    },
  };
}

virtualApiResolver.loader = loader;
