/**
 * @return {import('vite').Plugin}
 */
export default function minifyCssPlugin() {
  return {
    name: 'vite-minify-css',
    transform(code, id) {
      if (id.endsWith('css?raw')) {
        let minifyCss = code
          .replace(/\s+\{/g, '{')
          .replace(/(\{|\}|;)\\n\s+/g, (_, $0) => $0)
          .replace(/:\s+/g, ':')
          .replace(/\\n\\n\s*/g, '')
          .replace(/;?(\\n)*\}/g, '}')
          .trim();
        return {
          code: minifyCss,
          map: null,
        };
      }
    }
  };
};