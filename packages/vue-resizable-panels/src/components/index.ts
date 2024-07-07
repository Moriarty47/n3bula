import ResizePanelGroup from './panel-group.vue';
import ResizePanel from './panel.vue';
import ResizeHandle from './resize-handle.vue';
import type { App } from 'vue';

export const install = (app: App) => {
  app.component('resize-panel-group', ResizePanelGroup);
  app.component('resize-panel', ResizePanel);
  app.component('resize-handle', ResizeHandle);
};

export {
  ResizePanelGroup,
  ResizePanel,
  ResizeHandle
}

