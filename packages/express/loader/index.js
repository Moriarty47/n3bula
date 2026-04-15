import { register } from 'node:module';
import { resolve as pathResolve } from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

const novaPath = pathToFileURL(pathResolve(cwd(), 'nova.config')).href;
await Promise.any(['.js', '.ts'].map(ext => import(`${novaPath}${ext}`))).catch(() => {});

register('./api-resolver.js', import.meta.url);
