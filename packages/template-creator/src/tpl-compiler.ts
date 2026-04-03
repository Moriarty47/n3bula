import { statSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import Handlebars from 'handlebars';
import { mkdirp } from 'mkdirp';

import { useDefer } from './utils';

import type { CommandOptions } from './types';

type Marker = {
  sum: number;
  count: number;
};

const defer = useDefer<void>();

async function tplCompile(
  templatePath: string,
  templateData: CommandOptions,
  destFilePath: string,
  marker: Marker,
) {
  const templateContent = await fs.readFile(templatePath, {
    encoding: 'utf-8',
  });
  const compiler = Handlebars.compile(templateContent);

  const fileContent = compiler(templateData);

  await fs.writeFile(destFilePath, fileContent, { encoding: 'utf8' });

  marker.count++;

  if (marker.count !== marker.sum) return;
  defer.resolve();
}

async function compileDir(
  dirTplPath: string,
  dirDestPath: string,
  dirTplData: CommandOptions,
  marker: Marker,
) {
  const fileNames = (await fs.readdir(dirTplPath, { encoding: 'utf8' })).filter(
    file => !['node_modules', '.DS_Store', '.log'].some(f => file.includes(f)),
  );

  const length = fileNames.length;
  marker.sum += length;

  await Promise.all(
    fileNames.map(file => {
      const filePath = path.join(dirTplPath, file);
      const destFilePath = path.join(dirDestPath, file);

      const isDirectory = statSync(filePath).isDirectory();
      if (isDirectory) {
        marker.count++;
        return compileDir(filePath, destFilePath, dirTplData, marker);
      } else {
        return tplCompile(filePath, dirTplData, destFilePath, marker);
      }
    }),
  );
}

export async function dirTplCompile(
  dirTplPath: string,
  dirDestPath: string,
  dirTplData: CommandOptions,
) {
  await mkdirp(dirDestPath);

  const marker = { count: 0, sum: 0 };

  const dirs = await collectDirs(dirTplPath, dirDestPath);

  await ensureDestDirs(dirs);

  compileDir(dirTplPath, dirDestPath, dirTplData, marker);

  return defer.promise;
}

function ensureDestDirs(dirs: string[]) {
  return Promise.all(dirs.map(dir => mkdirp(dir)));
}

async function collectDirs(srcRoot: string, destRoot: string) {
  const dirs = new Set<string>();

  async function walk(srcDir: string) {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    await Promise.all(
      entries.map(async ent => {
        const srcPath = path.join(srcDir, ent.name);
        const rel = path.relative(srcRoot, srcPath);
        const destPath = path.join(destRoot, rel);

        if (ent.isDirectory()) {
          dirs.add(destPath);
          await walk(srcPath);
        } else if (ent.isFile()) {
          dirs.add(path.dirname(destPath));
        }
      }),
    );
  }

  dirs.add(destRoot);
  await walk(srcRoot);

  const result = Array.from(dirs);
  result.sort((a, b) => a.length - b.length); // parent dir comes before child dir
  return result;
}
