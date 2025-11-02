import { createApp } from 'vue';

import App from './App.vue';

import { createContainer } from './utils';
import clickOutside from './directives/click-outside';

export default () => {
  createApp(App).use(clickOutside).mount(createContainer('.{{packageName}}-box'));
};