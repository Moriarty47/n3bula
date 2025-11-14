const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { mkdirp } = require('mkdirp');
const { execSync } = require('child_process');
const { dirTplCompile } = require('./tplCompiler');
const { decapitalize, camel2kebab, kebab2camel } = require('./utils');

const usePackagePath = (pt, name) => path.resolve(pt, `./${name}`);

async function create(cwd, templateData) {
  const { packageName } = templateData;
  const spinner = ora(
    `The package ${packageName} is generating.....`
  ).start();
  const packagePath = usePackagePath(cwd, packageName);

  try {
    await mkdirp(packagePath);

    const tplPath = path.join(__dirname, '../template');
    await dirTplCompile(tplPath, templateData, packagePath);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log();
    spinner.succeed(chalk.green(`Generate ${packagePath} success!`));
    console.log();

  } catch (error) {
    if (err) {
      console.error(err);
    }
  }
}

module.exports = async (cwd, packageName, options) => {
  console.log();
  packageName = camel2kebab(decapitalize(packageName));
  libraryName = kebab2camel(packageName);

  if (options.dir) {
    return create(cwd, { packageName });
  }

  let userName = execSync('git config --get user.name');
  let userEmail = execSync('git config --get user.email');
  const gitUserName = userName && userName.toString().trim();
  const gitUserEmail = userEmail && userEmail.toString().trim();

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'packageName',
      message: `Use this package name?`,
      default: packageName,
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
  ]);

  answer.packageKeywords = answer.packageKeywords
    .split(',')
    .map(word => `\"${word}\"`);
  return create(cwd, answer);
};