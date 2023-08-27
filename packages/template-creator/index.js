#!/usr/bin/env node

const path = require('path');
const { Command } = require('commander');
const package = require('./package.json');
const createPackage = require('./lib/createPackage');

const cwd = path.dirname(path.dirname(__dirname, '../packages'));

const program = new Command();

program
  .name('n3bula')
  .description('CLI to create a n3bula package template.')
  .version(package.version);

program
  .command('create')
  .alias('c')
  .description('Create a n3bula package template.')
  .argument('<package_name>', 'The package name')
  .option('-d, --dir <path>', 'An absolute path of the template directory.')
  .action((str, options) => createPackage(cwd, str, options))
  .showHelpAfterError('\ncreate|c <package_name> is required.');

program.parse();
