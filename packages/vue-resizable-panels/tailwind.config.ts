import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';

const flexCenterBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const config: Config = {
  corePlugins: { preflight: false },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./app.vue",
  ],
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