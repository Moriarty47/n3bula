const ora = require('ora');
const chalk = require('chalk');

const log = {
  init(...rest) {
    console.log('Initializing project at ', chalk.bold.green(...rest));
  },
  success(...rest) {
    console.log(chalk.green(...rest));
  },
  info(...rest) {
    console.log(chalk.blue(...rest));
  },
  error(...rest) {
    console.log(chalk.bold.red(...rest));
  },
  warn(...rest) {
    console.log(chalk.hex('#FFA500')(...rest));
  }
};

/**
 * @this {import('ora').Ora}
 * @param {string[]} texts 
 * @param {number} [delay=500] 
 * @returns {() => void}
 */
function changeSpinner(texts, delay = 500) {
  const len = texts.length - 1;
  let i = 0;
  let timer = setInterval(() => {
    if (i > len) {
      i = 0;
    }
    this.text = texts[i++];
  }, delay);
  return () => {
    clearInterval(timer);
    timer = null;
  };
}

module.exports = {
  log,
  /**
   * @param {string} text 
   * @returns {import('ora').Ora & { change: typeof changeSpinner }}
   */
  useSpinner(text) {
    const spinner = ora(text + '\n').start();
    spinner.color = 'gray';
    spinner.pollingChange = changeSpinner.bind(spinner);
    return spinner;
  },
};