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
    backgroundImage: {
      'gradient-pattern': 'linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))',
    },
    fontFamily: {
      'roboto': 'Roboto,Arial,sans-serif',
    },
    extend: {
    },
  },
  plugins: [
    plugin(({ addVariant, addUtilities }) => {
      addVariant('hocus', ['&:focus', '&:hover']);
      addVariant('peer-hocus', [':merge(.peer):focus ~ &', ':merge(.peer):hover ~ &']);

      addUtilities({
        '.flex-center': flexCenterBase,
        '.flex-row-center': flexCenterBase,
        '.flex-col-center': { ...flexCenterBase, flexDirection: 'column' },
        '.border-dark': { border: '1px solid #ffffff1a' },
        '.border-light': { border: '1px solid #0000001a' },
      });
    })
  ],
};

// const addVariantWithStates = (variant, selector) => {
//   addVariant(variant, `&${selector}`)
//   addVariant(`group-${variant}`, `:merge(.group)${selector} &`)
//   addVariant(`peer-${variant}`, `:merge(.peer)${selector} ~ &`)
// }

export default config;