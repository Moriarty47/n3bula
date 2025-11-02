const chalk = require('chalk');
const { capitalize, decapitalize, kebab2camel, camel2kebab } = require('@n3bula/utils');

const message = {
  log: msg => console.log(chalk.cyan(msg)),
  success: msg => console.log(chalk.green(msg)),
  successTag: (tag, msg) => console.log(`${chalk.green(tag)}: ${chalk.white(msg)}`),
  error: msg => console.log(chalk.red(msg)),
};

module.exports = {
  message,
  capitalize,
  decapitalize,
  camel2kebab,
  kebab2camel
};