import ResizePanelGroup from './panel-group.vue';
import ResizePanel from './panel.vue';
import ResizeHandle from './resize-handle.vue';
import type { App } from 'vue';
import '@/style.css';

export const install = (app: App) => {
  app.component('ResizePanelGroup', ResizePanelGroup);
  app.component('ResizePanel', ResizePanel);
  app.component('ResizeHandle', ResizeHandle);
};

export {
  ResizePanelGroup,
  ResizePanel,
  ResizeHandle
}

