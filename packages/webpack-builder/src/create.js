const ejs = require('ejs');
const path = require('path');
const { globSync } = require('glob');
const { spawnSync, spawn } = require('child_process');
const {
  statSync,
  mkdirSync,
  existsSync,
  copyFileSync,
  readFileSync,
  writeFileSync
} = require('fs');
const { log, useSpinner } = require('./utils.js');

const cwd = process.cwd();

const templateDirPath = path.resolve(__dirname, '../template');

/**
 * @param {import('.').Config} config 
 * @returns {{dst: string, config: import('.').Config}}
 */
function createTemplate(config) {
  const projectPath = path.resolve(cwd, './', config.name);

  log.init(projectPath);
  const spinner = useSpinner('Getting templates...');

  try {
    if (existsSync(projectPath)) {
      log.error('Project name exists, Process aborted.');
      process.exit(0);
    } else {
      return { dst: copyFiles(projectPath), config };
    }
  } catch (error) {
    log.error(error);
    process.exit(1);
  }

  function copyFiles(dst) {
    const templateGlob = path.relative(cwd, templateDirPath).replace(/\\/g, '/');
    const pattern = templateGlob + '/{,!(node_modules)/**}/{,!(*-lock).*}';

    const templateDir = globSync(pattern, { dot: true, absolute: true });

    let i = 0;
    spinner.color = 'blue';
    templateDir.forEach(srcPt => {
      const filename = path.relative(templateDirPath, srcPt);

      let dstPt = path.join(dst, filename);
      const stat = statSync(srcPt);
      if (filename === 'gitignore.template') {
        dstPt = path.join(dst, '.gitignore');
      }
      if (stat.isDirectory()) {
        mkdirSync(dstPt, { recursive: true });
      } else if (filename.includes('package.json')) {
        createPackageJson(srcPt, dstPt);
      } else if (filename.includes('index.html')) {
        createIndexHtml(srcPt, dstPt);
      } else {
        copyFileSync(srcPt, dstPt);
        spinner.text = `Create file ${dstPt}`;
        console.log(spinner.text);
      }
      i++;
    });

    if (i !== templateDir.length) {
      log.error('Something went wrong.');
      process.exit(0);
    }

    spinner.color = 'green';
    spinner.text = 'Created tempaltes.';
    spinner.succeed();
    return projectPath;
  };

  function createPackageJson(srcPt, dstPt) {
    const json = JSON.parse(readFileSync(srcPt, 'utf8'));
    json.name = config.name;
    json.description = config.description;
    writeFileSync(dstPt, JSON.stringify(json, null, 2), 'utf8');
  }

  function createIndexHtml(srcPt, dstPt) {
    const html = readFileSync(srcPt, 'utf8');
    const template = ejs.compile(html)({
      title: config.name,
      content: `Welcome to ${config.name}!`
    });
    writeFileSync(dstPt, template, 'utf8');
  }
};

/**
 * @param {{dst: string, config:import('.').Config}} 
 * @returns {{dst: string, config: import('.').Config}}
 */
function installPackages({ dst, config }) {
  const spinner = useSpinner('Installing packages...');

  process.chdir(dst);

  const cancelInterval = spinner.pollingChange([
    'Installing packages.',
    'Installing packages..',
    'Installing packages...',
  ]);

  const result = spawn(`${config.command}.cmd`, ['install'], {
    cwd: process.cwd(),
    env: process.env,
  });

  return new Promise((resolve, reject) => {
    result.on('close', code => {
      if (code !== 0) {
        spinner.text = 'Something went wrong.';
        spinner.fail();
        clearInterval();
        reject();
        return;
      }
      spinner.text = 'Packages installed.';
      spinner.succeed();
      cancelInterval();
      resolve({ dst, config });
    });
  });
}


/**
 * @param {import('.').Config} config 
 */
function runProject(config) {
  spawnSync(`${config.command}.cmd`, ['run', 'start'], {
    encoding: 'utf8',
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
}

module.exports = {
  createTemplate,
  installPackages,
  runProject,
};