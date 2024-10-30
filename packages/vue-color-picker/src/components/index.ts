import ColorPicker from './color-picker.vue';
import type { App } from 'vue';
import '@/style.css';

export const install = (app: App) => {
  app.component('ColorPicker', ColorPicker);
};

export {
  ColorPicker
}

