import { createPinia } from 'pinia';
import ResizePanelGroup from './panel-group.vue';
import ResizePanel from './panel.vue';
import ResizeHandle from './resize-handle.vue';
import '@/style.css';

import type { App } from 'vue';

export const install = (app: App) => {
  app.use(createPinia());
  app.component('ResizePanelGroup', ResizePanelGroup);
  app.component('ResizePanel', ResizePanel);
  app.component('ResizeHandle', ResizeHandle);
};

export { ResizePanelGroup, ResizePanel, ResizeHandle };
