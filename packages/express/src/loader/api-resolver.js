await Promise.any(['.js', '.ts'].map(ext => import(`../nova.config${ext}`))).catch(console.error);

import { virtualApiResolver } from '@n3bula/express';

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

  const source = await virtualApiResolver.loader.getCode();

  return {
    format: 'module',
    source,
    shortCircuit: true,
  };
}
