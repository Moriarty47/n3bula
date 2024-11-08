import path from 'node:path';
import fs from 'node:fs/promises';
import { Database } from '@/database';
import { currentWorkingDirectory, mkdirIfNotExists } from '@/utils';
import { DEFAULT_DB_EXT } from './constants';
import type { REPLServer } from 'node:repl';

export const databases = new Map<string, Database>();

export const preloadDatabase = async (repl: REPLServer) => {
  try {
    const databasesDir = path.resolve(currentWorkingDirectory, './db');
    mkdirIfNotExists(databasesDir);

    const dirs = await fs.readdir(databasesDir, { withFileTypes: true });

    const ext = `.${DEFAULT_DB_EXT}`;
    for (const dir of dirs) {
      if (dir.isFile()) continue;
      const dbName = path.basename(dir.name, ext);
      const db = new Database(dbName);
      databases.set(dbName, db);
    }

    console.log('preload done!');
    repl.displayPrompt();
  } catch (error) {
    console.error(error);
  }
};
