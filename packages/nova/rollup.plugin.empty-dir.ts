import { opendir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin } from 'rollup';

export function emptyDirs(options: { dirs: string | string[]; ignored?: string[] }): Plugin {
  let { dirs, ignored = [] } = options;
  if (typeof dirs === 'string') dirs = [dirs];

  const emptyDir = async (dir: string) => {
    let files;
    try {
      files = await opendir(dir);
    } catch (error: any) {
      switch (error.code) {
        case 'ENOENT':
          return;
        case 'ENOTDIR':
          throw new Error(`${dir} is not a directory`);
        default:
          throw error;
      }
    }

    for await (const file of files) {
      if (ignored.includes(file.name)) continue;
      const filePath = join(dir, file.name);
      await rm(filePath, { recursive: true });
    }
  };

  const handler = async () => {
    for (const dir of dirs) {
      await emptyDir(dir);
    }
  };

  return {
    name: 'rollup-plugin-empty-dir',
    buildStart: {
      order: 'pre',
      sequential: true,
      handler,
    },
  };
}
