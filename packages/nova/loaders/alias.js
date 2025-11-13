import path from 'node:path';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const packageJson = JSON.parse(readFileSync(path.resolve('./package.json'), 'utf8'));

export const resolve = generateAliasesResolver({ ...packageJson.aliases });


function generateAliasesResolver(aliasesToAdd, options) {
  const getAliases = () => {

    const base = process.cwd();

    const absoluteAliases = Object.keys(aliasesToAdd).reduce((acc, key) =>
      aliasesToAdd[key][0] === '/'
        ? acc
        : { ...acc, [key]: path.join(base, aliasesToAdd[key]) },
      aliasesToAdd);

    return absoluteAliases;

  };

  const isAliasInSpecifier = options?.matcher ?? ((path, alias) => {
    return path.indexOf(alias) === 0
      && (path.length === alias.length || path[alias.length] === '/');
  });

  const aliases = getAliases();
  const aliasesKeys = Object.keys(aliases);

  return (specifier, parentModuleURL, defaultResolve) => {

    const alias = aliasesKeys.find((key) => isAliasInSpecifier(specifier, key));

    const newSpecifier = alias === undefined
      ? specifier
      : pathToFileURL(path.join(aliases[alias], specifier.substr(alias.length))).href;

    return defaultResolve(newSpecifier, parentModuleURL);
  };
}
