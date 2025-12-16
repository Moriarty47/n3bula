import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import { join } from 'node:path';
import SVGO from 'svgo/lib/svgo';
import { transform } from '@babel/core';

import svgoConfig from './svgo.config';
import {
  allModulesBabelConfig,
  makeBasicDefinition,
  makeThemeCss,
  moduleBabelConfig,
  parseStyles,
  parseSvg,
  toComponentName,
} from './utils';
import colosMap from './color-map';

const outputDir = join(__dirname, '../', 'dist');
const sourceFile = join(__dirname, '../', 'source.html');

async function build() {
  await fs.remove(outputDir);

  const html = await fs.readFile(sourceFile, 'utf8');
  const document = new JSDOM(html).window.document;

  let exports = '';
  let definition = makeBasicDefinition();

  const icons = document.querySelectorAll('[data-state="closed"]');
  const svgo = new SVGO(svgoConfig);
  const promises = Array.from(icons).map(async icon => {
    const name = icon.querySelector('p').textContent;
    const componentName = toComponentName(name);
    const fileName = name;

    const svg = icon.querySelector('svg');
    const { data: optimizedSvgString } = await svgo.optimize(svg.outerHTML);
    const styles = parseStyles(svg.getAttribute('style'));

    const component = `const ${componentName} = ({ color = 'currentColor', size = 24, style, ...props }) => {
  return ${parseSvg(optimizedSvgString, styles)}
}
export default ${componentName};`;
    exports += `export { default as ${componentName} } from './${fileName}.js';\n`;
    definition += `export const ${componentName}: Icon;\n`;

    const componentDefinition = `${makeBasicDefinition()}declare const ${componentName}: Icon;
export default ${componentName};\n`;
    const componentCode = transform(component, moduleBabelConfig).code;
    await outputFile(`${fileName}.d.ts`, componentDefinition);
    await outputFile(`${fileName}.js`, componentCode);
  });

  await Promise.all(promises);

  const allModulsCode = transform(exports, allModulesBabelConfig).code;
  await outputFile('index.d.ts', definition);
  await outputFile('index.js', allModulsCode);
  await outputFile('index.css', makeThemeCss(colosMap));
}

build();

async function outputFile(path: string, data: string) {
  return fs.outputFile(join(outputDir, path), data);
}
