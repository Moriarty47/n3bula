import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import minifyCssPlugin from './vite.minify-css-literal';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    cssMinify: true,
  },
  resolve: {
    alias: {
      '@utils': path.join(__dirname, './src/utils.js'),
      '@comps': path.join(__dirname, './src/components'),
      '@drets': path.join(__dirname, './src/directives'),
      '@lib': path.join(__dirname, './lib'),
    }
  },
  plugins: [
    vue(),
    minifyCssPlugin(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://www.google.com/s2/favicons?sz=64&domain=baidu.com',
        namespace: 'https://www.baidu.com',
        match: ['https://www.baidu.com'],
        "run-at": 'document-end',
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        }
      }
    }),
  ],
});
