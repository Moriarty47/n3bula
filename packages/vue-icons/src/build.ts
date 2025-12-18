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
    let componentCode = transform(component, moduleBabelConfig).code;
    componentCode = componentCode.replace(`import{createVNode as _createVNode,mergeProps as _mergeProps}from"vue";import _extends from"@babel/runtime/helpers/extends";import _objectWithoutProperties from"@babel/runtime/helpers/objectWithoutProperties";var _excluded=["color","size","style"];`, `import{_createVNode,_getProps}from"./_vendor.js";`);
    componentCode = componentCode.replace(`var _ref$color=_ref.color,color=_ref$color===void 0?"currentColor":_ref$color,_ref$size=_ref.size,size=_ref$size===void 0?24:_ref$size,style=_ref.style,props=_objectWithoutProperties(_ref,_excluded);`, '');
    componentCode = componentCode.replace(/_mergeProps\({"stroke-linejoin":"round","viewBox":("\d+\s\d+\s\d+\s\d+")},props,{"height":size,"width":size,"style":_extends\({},style,{color:color}\)}\)/, (_, $1) => `_getProps(_ref,${$1})`);
    
    await outputFile(`${fileName}.d.ts`, componentDefinition);
    await outputFile(`${fileName}.js`, componentCode);
  });

  await Promise.all(promises);

  const allModulsCode = transform(exports, allModulesBabelConfig).code;
  const vendorCode = `import{_mergeProps as _mergeProps}from"vue";import _objectWithoutProperties from"@babel/runtime/helpers/objectWithoutProperties";import _extends from"@babel/runtime/helpers/extends";export{createVNode as _createVNode}from"vue";var _excluded=["color","size","style"];export var _getProps=(_ref,viewBox)=>{var _ref$color=_ref.color,color=_ref$color===void 0?"currentColor":_ref$color,_ref$size=_ref.size,size=_ref$size===void 0?24:_ref$size,style=_ref.style,props=_objectWithoutProperties(_ref,_excluded);return _mergeProps({"stroke-linejoin":"round",viewBox},props,{"height":size,"width":size,"style":_extends({},style,{color:color})})};`;
  await outputFile('index.d.ts', definition);
  await outputFile('index.js', allModulsCode);
  await outputFile('_vendor.js', vendorCode);
  await outputFile('index.css', makeThemeCss(colosMap));
}

build();
async function outputFile(path: string, data: string) {
  return fs.outputFile(join(outputDir, path), data);
}
