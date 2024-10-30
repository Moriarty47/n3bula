const postCssConfig = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    /** @type {Parameters<typeof import('postcss-prefix-selector')>[0]} */
    'postcss-prefix-selector': {
      prefix: '.color-picker',
      exclude: ['html', 'body'],
      transform(prefix, selector, prefixedSelector, filePath, rule) {
        if (filePath.match(/node_modules/)) return selector;

        const annotation = rule.prev();

        if (annotation?.type === 'comment' && annotation.text.trim() === 'no-prefix') return selector;

        return prefixedSelector;
      }
    }
  },
};

export default postCssConfig;