import { virtualApiResolver } from '../dist/index.js';

const apiResolver = 'virtual:api-resolver';

export async function resolve(specifier, context, defaultResolve) {
  if (specifier === apiResolver)
    return {
      shortCircuit: true,
      url: specifier,
    };

  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url !== apiResolver || !virtualApiResolver)
    return defaultLoad(url, context, defaultLoad);

  let source = '';
  if (typeof virtualApiResolver?.loader?.getCode === 'function') {
    source = await virtualApiResolver.loader.getCode();
  } else {
    source = `export const apis = {};`;
  }

  return {
    format: 'module',
    shortCircuit: true,
    source,
  };
}
