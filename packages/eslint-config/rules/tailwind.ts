import tailwindPlugin from 'eslint-plugin-tailwindcss';

type RulesForTailwindKey =
  | 'classnames-order'
  | 'enforces-negative-arbitrary-values'
  | 'enforces-shorthand'
  | 'migration-from-tailwind-2'
  | 'no-arbitrary-value'
  | 'no-contradicting-classname'
  | 'no-custom-classname'
  | 'no-unnecessary-arbitrary-value';

  type RulesForTailwind = Record<RulesForTailwindKey, 'off' | 'warn' | 'error'>;

function tailwind(rules: RulesForTailwind = {} as RulesForTailwind) {
  const [base, defaultRules] = tailwindPlugin.configs['flat/recommended'];
  return [
    base,
    {
      name: 'tailwindcss:rules',
      rules: {
        ...defaultRules.rules,
        'tailwindcss/no-custom-classname': 'off',
        ...rules,
      },
    },
  ];
}

export default tailwind;
