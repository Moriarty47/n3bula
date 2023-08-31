const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { mkdirp } = require('mkdirp');
const { execSync } = require('child_process');
const { dirTplCompile } = require('./tplCompiler');
const { decapitalize, camel2kebab, kebab2camel } = require('./utils');

const usePackagePath = (pt, name) => path.resolve(pt, `./packages/${name}`);

function create(cwd, templateData, resolve, reject) {
  const { packageName, templateType } = templateData;
  const spinner = ora(
    `The package ${packageName} is generating.....`
  ).start();
  const packagePath = usePackagePath(cwd, packageName);

  mkdirp(packagePath)
    .then(async () => {
      const tplPath = path.join(__dirname, '../template/', templateType);

      await dirTplCompile(tplPath, templateData, packagePath);
      setTimeout(() => {
        console.log();
        spinner.succeed(chalk.green(`Generate ${packagePath} success!`));
        resolve();
      }, 1000);
    })
    .catch(err => {
      if (err) {
        console.error(err);
        return reject();
      }
    });
}

module.exports = (cwd, packageName, options) => new Promise((resolve, reject) => {
  console.log();
  packageName = camel2kebab(decapitalize(packageName));
  libraryName = kebab2camel(packageName);

  if (!options.dir) {
    let userName = execSync('git config --get user.name');
    let userEmail = execSync('git config --get user.email');
    const gitUserName = userName && userName.toString().trim();
    const gitUserEmail = userEmail && userEmail.toString().trim();

    inquirer.prompt([
      {
        type: 'list',
        name: 'templateType',
        message: `Which template do you need?`,
        choices: ['esm', 'umd'],
        default: 'esm',
      },
      {
        type: 'input',
        name: 'packageName',
        message: `Use this package name?`,
        default: packageName,
      },
      {
        type: 'input',
        name: 'libraryName',
        message: `Library name:`,
        default: libraryName,
      },
      {
        type: 'input',
        name: 'libarayDesc',
        message: `Package description:`,
        default: '',
      },
      {
        type: 'input',
        name: 'gitAuthor',
        message: `Author name:`,
        default: gitUserName,
      },
      {
        type: 'input',
        name: 'gitAuthorEmail',
        message: `Author email:`,
        default: gitUserEmail,
      },
      {
        type: 'input',
        name: 'packageVersion',
        message: `Package version?`,
        default: '0.0.1',
      },
      {
        type: 'input',
        name: 'packageKeywords',
        message: `Package keywords?`,
        suffix: chalk.gray(' seperate with comma'),
        default: '',
      }
    ]).then((answer) => {
      answer.packageKeywords = answer.packageKeywords
        .split(',')
        .map(word => `\"${word}\"`);
      create(cwd, answer, resolve, reject);
    });
    return;
  }
  create(cwd, { packageName }, resolve, reject);
});