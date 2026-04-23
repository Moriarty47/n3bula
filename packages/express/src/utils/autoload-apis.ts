import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

import { logger } from './log';

const DEFAULT_APIS_DIR = path.resolve(cwd(), 'src/apis');

async function autoImport(
  dir: string,
  apis: Record<string, () => Promise<any>>,
) {
  dir = path.resolve(cwd(), dir);
  console.log(dir);
  if (!fs.existsSync(dir)) {
    logger.warn(`Path not exists`, dir);
    return;
  }

  const files = await fsp.readdir(dir);

  return files
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
    .reduce((apis, file) => {
      const { name } = path.parse(file);
      apis[name] = () => import(pathToFileURL(path.resolve(dir, file)).href);
      return apis;
    }, apis);
}

export async function autoImportApis(
  dirPaths: string | string[] = DEFAULT_APIS_DIR,
) {
  let paths;
  if (typeof dirPaths === 'string') paths = [dirPaths];
  else if (Array.isArray(dirPaths)) paths = dirPaths;
  else {
    throw new TypeError('autoImport paths should be a string or string[]');
  }
  const apis: Record<string, () => Promise<any>> = {};

  await Promise.all(paths.map(p => autoImport(p, apis)));

  return apis;
}
