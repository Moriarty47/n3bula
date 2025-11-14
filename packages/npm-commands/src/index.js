import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const globalNodeMoudules = execSync('npm root -g --silent', { encoding: 'utf8' }).trim();

const globalNodePath = resolve(globalNodeMoudules, '..');

const commands = readdirSync(globalNodePath, { encoding: 'utf8', withFileTypes: true })
  .filter(dirent => dirent.isFile() && (dirent.name.toLowerCase() !== 'license' && !dirent.name.includes('.')))
  .map(dirent => dirent.name);
  
console.log('\x1b[36mAll installed global npm commands:\x1b[m', commands);

