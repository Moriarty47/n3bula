import { Command } from 'commander';

import pkg from '../package.json';
import { createPackage } from './create-package';
import { logger } from './utils';

const program = new Command();

program
  .name('n3bula')
  .description('CLI to create a n3bula package template.')
  .version(pkg.version);

program
  .command('create')
  .alias('c')
  .description('Create a n3bula package template.')
  .argument('<package_name>', 'The package name')
  .option('-d, --dev', 'dev mode')
  .action((str, options) => createPackage(str, options))
  .showHelpAfterError('\ncreate|c <package_name> is required.');

program.parse();

process.on('uncaughtException', error => {
  if (error instanceof Error && error.name === 'ExitPromptError') {
    return logger.success('Exit.');
  }
  throw error;
});
