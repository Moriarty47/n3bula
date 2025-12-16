import fetch from 'node-fetch';
import { join } from 'node:path';
import { copyFile, writeFile } from 'fs-extra';

const sourceFile = join(__dirname, '../source.html');
const lastSourceFile = join(__dirname, '../last-source.html');

async function main() {
  try {
    const res = await fetch('https://vercel.com/design/icons');
    const html = await res.text();
    await copyFile(sourceFile, lastSourceFile);
    await writeFile(sourceFile, html);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
