const chalk = require('chalk');

const message = {
  log: msg => console.log(chalk.cyan(msg)),
  success: msg => console.log(chalk.green(msg)),
  successTag: (tag, msg) => console.log(`${chalk.green(tag)}: ${chalk.white(msg)}`),
  error: msg => console.log(chalk.red(msg)),
};

/**
 * @description Capitalize
 * @param {string} str
 * @return {string} 
 */
function capitalize(str = '') {
  if (!str) return '';
  const firstLetter = str.slice(0, 1) || '';
  const rest = str.slice(1);
  return String(firstLetter).toUpperCase() + rest;
}

/**
 * @description decapitalize
 * @param {string} str
 * @return {string} 
 */
function decapitalize(str = '') {
  if (!str) return '';
  const firstLetter = str.slice(0, 1) || '';
  const rest = str.slice(1);
  return String(firstLetter).toLowerCase() + rest;
}

/**
 * @description camelcase to kebabcase
 * @param {string} str
 * @return {string} 
 */
function camel2kebab(str = '') {
  if (!str) return '';
  return (str || '')
    .replace(/([A-Z])(\w)/g, (_, p1, p2) => `-${p1.toLowerCase()}${p2}`)
    .replace(/_/gm, '-');
}

/**
 * @description kebabcase to camelcase
 * @param {string} str
 * @return {string} 
 */
function kebab2camel(str = '') {
  if (!str) return '';
  return (str || '')
    .replace(/[-_](\w)/g, (_, p1) => p1.toUpperCase());
}

module.exports = {
  message,
  capitalize,
  decapitalize,
  camel2kebab,
  kebab2camel
};