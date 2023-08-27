const fs = require('fs');
const path = require('path');
const { mkdirp } = require('mkdirp');
const Handlebars = require('handlebars');

/**
 * @param {string} templatePath 
 * @param {object} templateData 
 * @param {string} destFilePath 
 * @param {Function} resolve 
 */
async function tplCompile(templatePath, templateData, destFilePath, resolve) {
  const templateContent = fs.readFileSync(templatePath, { encoding: 'utf-8' });

  const compiler = Handlebars.compile(templateContent);

  const fileContent = compiler(templateData);

  fs.writeFile(destFilePath, fileContent, (err) => {
    if (err) {
      throw err;
    }
    resolve.count++;
    if (resolve.count === resolve.sum) {
      resolve();
    }
  });
};

/**
 * @param {string} dirPath 
 * @param {Function} callback 
 */
async function mkdir(dirPath, callback) {
  await mkdirp(dirPath);
  callback && callback(dirPath);
}

/**
 * @param {string} dirTplPath 
 * @param {object} dirTplData 
 * @param {string} dirDestFilePath 
 * @param {Function} resolve 
 */
function compileDir(
  dirTplPath,
  dirTplData,
  dirDestFilePath,
  resolve,
) {
  fs.readdir(dirTplPath, { encoding: 'utf-8' }, async (err, fileNames) => {
    if (err) {
      throw err;
    }
    const length = fileNames.length;
    resolve.sum += length;
    for (let i = 0; i < length; i += 1) {
      const file = fileNames[i];
      if (file.includes('node_modules')) continue;
      const filePath = path.join(dirTplPath, file);
      const destFilePath = path.join(dirDestFilePath, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      if (isDirectory) {
        await mkdir(destFilePath);
        resolve.count++;
        compileDir(filePath, dirTplData, destFilePath, resolve);
      } else {
        await tplCompile(filePath, dirTplData, destFilePath, resolve);
      }
    }
  });
}

/**
 * @param {string} dirTplPath 
 * @param {object} dirTplData 
 * @param {string} dirDestFilePath 
 * @return {Promise}
 */
async function dirTplCompile(dirTplPath, dirTplData, dirDestFilePath) {
  await mkdir(dirDestFilePath);
  await new Promise(resolve => {
    resolve.sum = 0;
    resolve.count = 0;
    compileDir(dirTplPath, dirTplData, dirDestFilePath, resolve);
  });
};

module.exports = {
  tplCompile,
  dirTplCompile
};