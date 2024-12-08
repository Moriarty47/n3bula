import useESLintConfig, { commonRules } from '@n3bula/eslint-config';

export default useESLintConfig({
}, {
  files: ['**/webpack.*'],
  rules: {
    ...commonRules,
    'no-console': 'off',
  },
});
