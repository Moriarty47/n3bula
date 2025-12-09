import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';

const novaPath = pathToFileURL(pathResolve(cwd(), 'nova.config')).href;
await Promise.any(['.js', '.ts'].map(ext => import(`${novaPath}${ext}`))).catch(console.error);

import { virtualApiResolver } from '../dist/index.js';
import { pathToFileURL } from 'node:url';

const apiResolver = 'virtual:api-resolver';

export async function resolve(specifier, context, defaultResolve) {
  if (specifier === apiResolver)
    return {
      url: specifier,
      shortCircuit: true,
    };

  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url !== apiResolver || !virtualApiResolver) return defaultLoad(url, context, defaultLoad);

  let source = '';
  if (typeof virtualApiResolver?.loader?.getCode === 'function') {
    source = await virtualApiResolver.loader.getCode();
  } else {
    source = `export const apis = {};`;
  }

  return {
    format: 'module',
    source,
    shortCircuit: true,
  };
}
