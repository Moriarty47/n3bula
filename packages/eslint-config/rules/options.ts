import commonRules from './defaults.js';

import type { ESLinterConfig } from '../types';

function antfuOptions(config: ESLinterConfig = {}): ESLinterConfig {
  const { ignores = [], ...restOptions } = config;

  return {
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
    typescript: true,
    vue: {
      overrides: {
        ...commonRules,
      },
    },
    formatters: {
      css: true,
      html: true,
    },
    ...restOptions,
    ignores: [
      '**/.vscode/**',
      '**/.idea/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'pnpm-*.yaml',
      ...ignores,
    ],
  };
}

export default antfuOptions;
