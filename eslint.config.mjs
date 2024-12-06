import useESLintConfig, { commonRules } from '@n3bula/eslint-config';

export default useESLintConfig({
}, {
  files: ['**/webpack.*'],
  rules: {
    ...commonRules,
    'sort-keys': 'off',
    'no-console': 'off',
  },
});
