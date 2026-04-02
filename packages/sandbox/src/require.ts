import { createRequire } from 'node:module';

import type Module from 'node:module';

const requireCache = new Map<string, Module>();

export const _require = new Proxy(createRequire(import.meta.url), {
  apply(target, thisArg, argArray: [string]) {
    const [id] = argArray;
    const module = Reflect.apply(target, thisArg, argArray);

    requireCache.set(_require.resolve(id), module);
    return module;
  },
});

export function sandboxRequireCleanup() {
  requireCache.forEach((_, id) => {
    const module = _require.cache[id];
    if (!module) return;
    Reflect.deleteProperty(_require.cache, id);
  });
  requireCache.clear();
}
