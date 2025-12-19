import { Plugin } from 'rollup';
import { cwdRelative } from './util';

export function injectEnvPlugin(entryId: string, envPath: string): Plugin {
  return {
    name: 'inject-env-loader',
    generateBundle(_options, bundle) {
      if (!envPath) return;

      for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        if (chunkOrAsset.type !== 'chunk') continue;
        const chunk = chunkOrAsset;
        if (!chunk.modules || !Object.keys(chunk.modules).some(id => id === entryId)) continue;

        const code = chunk.code;
        const importRegex =
          /import([ \n\t]*(?:[^ \n\t\{\}]+[ \n\t]*,?)?(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)from[ \n\t]*(['"])([^'"\n]+)(?:['"])/g;
        let lastMatchIndex = -1;
        let m;
        while ((m = importRegex.exec(code)) !== null) {
          lastMatchIndex = m.index + m[0].length;
        }

        const appendCode = `import { config as dotEnvCfg } from 'dotenv';\ndotEnvCfg({ quiet: true, path: ${JSON.stringify(cwdRelative(envPath))} });`;
        let newCode;
        if (lastMatchIndex >= 0) {
          newCode = code.slice(0, lastMatchIndex) + '\n' + appendCode + '\n' + code.slice(lastMatchIndex);
        } else {
          newCode = code + '\n' + appendCode;
        }

        // 用修改后的代码替换 chunk.code
        chunk.code = newCode;
      }
    },
  };
}
