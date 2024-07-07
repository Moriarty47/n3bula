import type { Layout } from '@/components/store';
import type { PanelData } from '@/components/panel.vue';
import type { ResizePanelStorage } from './storage';

export type PanelConfigurationState = {
  expandToSizes: { [panelId: string]: number; };
  layout: Layout;
};
export type SerializedPanelGroupState = {
  [panelsIds: string]: PanelConfigurationState;
};

const getPanelGroupKey = (autoSaveId: string): string => `vue-resize-panels:${autoSaveId}`;

const getPanelKey = (panels: PanelData[]): string => panels
  .map(({ id }) => id)
  .sort((a, b) => a.localeCompare(b))
  .join(',');

const loadSerializedPanelGroupState = (autoSaveId: string, storage: ResizePanelStorage): SerializedPanelGroupState | null => {
  try {
    const panelGroupKey = getPanelGroupKey(autoSaveId);
    const serialized = storage.getItem(panelGroupKey);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (parsed && typeof parsed === 'object') return parsed as SerializedPanelGroupState;
    }

  } catch { }
  return null;
};

export const savePanelGroupState = (
  autoSaveId: string,
  panels: PanelData[],
  panelSizesBeforeCollapse: Map<string, number>,
  sizes: Layout,
  storage: ResizePanelStorage
): void => {
  const panelGroupKey = getPanelGroupKey(autoSaveId);
  const panelKey = getPanelKey(panels);
  const state = loadSerializedPanelGroupState(autoSaveId, storage) ?? {};
  state[panelKey] = {
    expandToSizes: Object.fromEntries(panelSizesBeforeCollapse.entries()),
    layout: sizes,
  };

  try {
    storage.setItem(panelGroupKey, JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
};

export const loadPanelGroupState = (
  autoSaveId: string,
  panels: PanelData[],
  storage: ResizePanelStorage
): PanelConfigurationState | null => {
  const state = loadSerializedPanelGroupState(autoSaveId, storage) ?? {};
  const panelKey = getPanelKey(panels);
  return state[panelKey] ?? null;
};