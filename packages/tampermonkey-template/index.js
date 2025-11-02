#!/usr/bin/env node

const { cwd } = require('process');
const { Command } = require('commander');
const package = require('./package.json');
const createPackage = require('./lib/createPackage');

const program = new Command();

program
  .name('tampermonkey')
  .description('CLI to create a tampermonkey template.')
  .version(package.version);

program
  .command('create')
  .alias('c')
  .description('Create a tampermonkey template.')
  .argument('<package_name>', 'The package name')
  .option('-d, --dir <path>', 'An absolute path of the template directory.')
  .action((str, options) => createPackage(cwd(), str, options))
  .showHelpAfterError('\ncreate|c <package_name> is required.');

program.parse();
