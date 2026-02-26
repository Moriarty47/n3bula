import { isAbsolute, normalize, resolve } from 'node:path';

export function toAbsolutePath(input: string, baseDir: string) {
  if (typeof input !== 'string' || input.trim() === '') {
    console.error('file path must be a non-empty string');
    process.exit(1);
  }

  if (isAbsolute(input)) return normalize(input);

  const abs = resolve(baseDir, input);
  return normalize(abs);
}

export function isFilenameOnly(input: string) {
  if (typeof input !== 'string' || input.length === 0) return false;
  // file:// URL
  if (/^file:\/\//i.test(input)) return false;
  // Contains forward or back slash => path
  if (input.includes('/') || input.includes('\\')) return false;
  // Windows drive letter absolute like C:\
  if (/^[a-zA-Z]:[\\/]/.test(input)) return false;
  // UNC path \\host\share
  if (/^\\\\[^\\]+\\/.test(input)) return false;
  // Otherwise treat as filename
  return true;
}