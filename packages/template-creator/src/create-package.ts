import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { input, select } from '@inquirer/prompts';
import { mkdirp } from 'mkdirp';
import ora from 'ora';

import { dirTplCompile } from './tpl-compiler';
import {
  camel2kebab,
  decapitalize,
  greenChalk,
  kebab2camel,
  sleep,
} from './utils';

import type { CommandOptions, ProgramOptions } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const destDirRoot = path.join(process.cwd(), 'packages');

async function create(answer: CommandOptions) {
  const { packageName, templateType } = answer;
  const spinner = ora(
    `The package ${greenChalk(packageName)} is generating...`,
  ).start();
  const packagePath = path.join(destDirRoot, packageName);

  if (fs.existsSync(packagePath)) {
    spinner.fail(`Package path already exists. ${packagePath}`);
    return;
  }

  await mkdirp(packagePath);

  const tplPath = path.join(__dirname, '../template', templateType);

  await dirTplCompile(tplPath, packagePath, answer);

  await sleep();
  console.log();
  spinner.succeed(`Generate ${greenChalk(packagePath)} success!`);
}

export const createPackage = async (
  packageName: string,
  options: ProgramOptions,
) => {
  console.log();
  packageName = camel2kebab(decapitalize(packageName));
  const libraryName = kebab2camel(packageName);

  if (options.dev) {
    return create({
      gitAuthor: '',
      gitAuthorEmail: '',
      libarayDesc: '',
      libraryName: '',
      packageKeywords: '',
      packageName,
      packageVersion: '',
      templateType: 'esm',
    });
  }

  const userName = execSync('git config --get user.name');
  const userEmail = execSync('git config --get user.email');
  const gitUserName = userName?.toString().trim() || '';
  const gitUserEmail = userEmail?.toString().trim() || '';

  const commands = [
    {
      choices: ['node', 'esm(webpack)', 'umd(webpack)'],
      default: 'node',
      message: `Which template do you need?`,
      name: 'templateType',
      type: 'select',
    },
    {
      default: packageName,
      message: `Use this package name?`,
      name: 'packageName',
      type: 'input',
    },
    {
      default: libraryName,
      message: `Library name:`,
      name: 'libraryName',
      type: 'input',
    },
    {
      default: '',
      message: `Package description:`,
      name: 'libarayDesc',
      type: 'input',
    },
    {
      default: gitUserName,
      message: `Author name:`,
      name: 'gitAuthor',
      type: 'input',
    },
    {
      default: gitUserEmail,
      message: `Author email:`,
      name: 'gitAuthorEmail',
      type: 'input',
    },
    {
      default: '0.0.1',
      message: `Package version?`,
      name: 'packageVersion',
      type: 'input',
    },
    {
      default: '',
      message: `Package keywords(seperate with comma)?`,
      name: 'packageKeywords',
      transformer: (value: string, { isFinal }: { isFinal: boolean }) =>
        isFinal
          ? value
              .split(',')
              .map(word => `"${word}"`)
              .join(',')
          : '',
      type: 'input',
    },
  ] as const;

  const answer = {} as CommandOptions;
  for (const cmd of commands) {
    const { name, default: defaultValue, message, type, ...rest } = cmd;
    if (type === 'select')
      answer[name] = await select({
        choices: cmd.choices,
        default: defaultValue,
        message,
        ...rest,
      });
    else if (type === 'input') {
      answer[name] = await input({ default: defaultValue, message, ...rest });
    }
  }

  return create(answer);
};
