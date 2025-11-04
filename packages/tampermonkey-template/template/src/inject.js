import { createApp } from 'vue';

import App from './App.vue';
import { createDrawerBox } from '@comps/Drawer/use-drawer-state';
import drawerClickOutside from '@comps/Drawer/drawer-click-outside';

import { createContainer } from '@utils';

export default async () => {
  await createDrawerBox();
  createApp(App)
    .use(drawerClickOutside)
    .mount(createContainer('.{{packageName}}-box'));
};