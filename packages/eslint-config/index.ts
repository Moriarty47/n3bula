import antfu from '@antfu/eslint-config';

import commonRules from './rules/defaults.js';
import antfuOptions from './rules/options.js';
import tailwind from './rules/tailwind.js';

import type {
  AntFuConfig,
  ESLinterConfig,
  UserConfigs,
} from './types';

export * from '@antfu/eslint-config';

export default function useESLintConfig(config: ESLinterConfig = {}, ...userConfigs: UserConfigs<typeof antfu>): AntFuConfig {
  return antfu(
    antfuOptions(config),
    {
      files: ['**/*.js', '**/*.jsx', '**/*.ts'],
      rules: {
        ...commonRules,
      },
    },
    {
      files: ['**/*.mjs', '**/*.mts'],
      rules: {
        ...commonRules,
      },
    },
    {
      files: ['**/*.json'],
      rules: {
        'jsonc/indent': ['warn', 2],
        'jsonc/sort-keys': 'off',
      },
    },
    {
      files: ['**/*.yaml', '**/*.yml'],
      rules: {
        'yaml/indent': ['warn', 2],
      },
    },
    ...userConfigs,
  );
}

export {
  antfuOptions,
  commonRules,
  tailwind,
  useESLintConfig,
};
