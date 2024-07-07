import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';

const flexCenterBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./app.vue",
    "./error.vue",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.flex-center': flexCenterBase,
        '.flex-row-center': flexCenterBase,
        '.flex-col-center': { ...flexCenterBase, flexDirection: 'column' }
      });
    })
  ],
};

export default config;