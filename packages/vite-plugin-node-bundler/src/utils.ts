import { access } from 'fs/promises';

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export type Format = 'es' | 'cjs' | 'iife';

export function defaultOutputExt({ format, pkgType }: { format: Format; pkgType?: string; }): { js: string; dts: string; } {
  let jsExt = '.js';
  let dtsExt = '.d.ts';
  const isModule = pkgType === 'module';
  if (isModule && format === 'cjs') {
    jsExt = '.cjs';
    dtsExt = '.d.cts';
  }
  if (!isModule && format === 'es') {
    jsExt = '.mjs';
    dtsExt = '.d.mts';
  }
  if (format === 'iife') {
    jsExt = '.global.js';
  }
  return { js: jsExt, dts: dtsExt };
}