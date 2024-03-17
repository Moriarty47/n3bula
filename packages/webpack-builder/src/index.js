const path = require('path');
const chalk = require('chalk');
const { existsSync } = require('fs');
const { createTemplate, installPackages, runProject } = require('./create.js');

const cwd = process.cwd();

const msgFormatter = input => chalk.bold.cyan(input);
const inputTransformer = input => chalk.greenBright(input);
const nameValidate = input => {
  const projectPath = path.resolve(cwd, './', input);
  if (existsSync(projectPath)) {
    return chalk.bgRed.bold('Project name exists, please check.');
  }
  return true;
};

import('inquirer').then(res => {
  const inquirer = res.default;

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: msgFormatter('What\'s this project called ?'),
        validate: nameValidate,
        transformer: inputTransformer,
      },
      {
        type: 'input',
        name: 'description',
        message: msgFormatter('Any description ?'),
        transformer: inputTransformer,
      },
      {
        type: 'list',
        name: 'command',
        message: msgFormatter('Which package manager prefer to use ?'),
        transformer: inputTransformer,
        choices: [
          { key: 'pnpm', name: 'pnpm', checked: true, },
          { key: 'yarn', name: 'yarn', },
          { key: 'npm', name: 'npm', },
        ]
      }
    ])
    .then(createTemplate)
    // .then(installPackages)
    .then(async ({ config }) => {
      const res = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'run',
          message: msgFormatter('Do you want run it right now?'),
        }
      ]);
      return { res, config };
    })
    .then(({ res, config }) => {
      if (res.run) {
        runProject(config);
      }
    });
});

/**
 * @typedef Config
 * @property {string} name
 * @property {string} description
 * @property {string} command
 */