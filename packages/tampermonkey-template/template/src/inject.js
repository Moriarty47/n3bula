import { createApp } from 'vue';

import App from './App.vue';

import { createContainer } from './utils';

export default () => {
  createApp(App).mount(createContainer('.{{packageName}}-box'));
};