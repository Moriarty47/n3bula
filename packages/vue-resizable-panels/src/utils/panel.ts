import Panel from '@/components/panel.vue';
import type { CSSProperties, VNode } from 'vue';
import type { PanelConstraint, PanelData } from '@/components/panel.vue';
import type { DragState, Layout, Panels } from '@/components/store';

export const getComponentId = (...ids: string[]) => ids.join('-');

export const getSlotId = (slot: VNode, key: string) => {
  const type = slot.type as any;
  if (type.name !== Panel.name) return type.name + '-' + key;
  const props = slot.props as any;
  return type.name + '-' + (props?.id || (type.props.id.default + '-' + key));
};

const getElementByAttributeName = (attributeName: string, id: string, scope: ParentNode | HTMLElement = document): HTMLElement | null => {
  const ele = scope.querySelector(`[${attributeName}='${id}']`);
  if (!ele) return null;
  return ele as HTMLElement;
};

export const getPanel = (id: string, scope: ParentNode | HTMLElement = document): HTMLElement | null => getElementByAttributeName('data-panel-id', id, scope);

export const getPanelDataIndex = (panels: PanelData[], panelData: PanelData) => panels.findIndex(panel => panel.id === panelData.id);

export const getPanelForGroup = (groudId: string, scope: ParentNode | HTMLElement = document): HTMLElement[] => Array.from(
  scope.querySelectorAll(`[data-panel][data-panel-group-id="${groudId}"]`)
);

export const getPanelGroup = (groupId: string, scope: ParentNode | HTMLElement = document): HTMLElement | null => {
  if (scope instanceof HTMLElement && (scope as HTMLElement)?.dataset?.panelGroupId === groupId) return scope;

  return getElementByAttributeName('data-panel-group][data-panel-group-id', groupId, scope);
};

export const getResizeHandle = (id: string, scope: ParentNode | HTMLElement = document): HTMLElement | null => getElementByAttributeName('data-resize-handle-id', id, scope);

export const getResizeHandleIndex = (groupId: string, id: string, scope: ParentNode | HTMLElement = document): number => {
  const handles = getResizeHandlesForGroup(groupId, scope);
  return handles.findIndex((handle) => handle.getAttribute('data-resize-handle-id') === id);
};

export const getResizeHandlesForGroup = (groupId: string, scope: ParentNode | HTMLElement = document): HTMLElement[] => {
  return Array.from(scope.querySelectorAll(
    `[data-resize-handle-id][data-panel-group-id='${groupId}']`
  ));
};

export const getResizeHandlePanelIds = (groupId: string, handleId: string, panelsArray: PanelData[], scope: ParentNode | HTMLElement = document): [prevId: string | null, nextId: string | null] => {
  const handle = getResizeHandle(handleId, scope);
  const handles = getResizeHandlesForGroup(groupId, scope);
  const i = handle ? handles.indexOf(handle) : -1;

  const prevId: string | null = panelsArray[i]?.id ?? null;
  const nextId: string | null = panelsArray[i + 1]?.id ?? null;

  return [prevId, nextId];
};

export const panelsMapToSortedArray = (panels: Panels): PanelData[] => Array.from(panels.values()).sort((a, b) => a.order! - b.order!);

export type PivotIndices = [prevIndex: number, nextIndex: number];
export const getPivotIndices = (groupId: string, dragHandleId: string, panelGroupElement: ParentNode): PivotIndices => {
  const index = getResizeHandleIndex(groupId, dragHandleId, panelGroupElement);

  return index >= 0 ? [index, index + 1] : [-1, -1];
};

export const getPanelFlexBoxStyle = ({
  defaultSize,
  dragState,
  layout,
  panels,
  panelIndex,
  precision = 3,
}: {
  defaultSize?: number;
  dragState: DragState | null;
  layout: Layout;
  panels: PanelData[];
  panelIndex: number;
  precision?: number;
}): CSSProperties => {
  const size = layout[panelIndex];
  let flexGrow: string;
  if (size == null) {
    flexGrow = defaultSize != undefined ? defaultSize.toPrecision(precision) : '1';
  } else if (panels.length === 1) {
    flexGrow = '1';
  } else {
    flexGrow = size.toPrecision(precision);
  }

  return {
    flex: `${flexGrow} 1 0px`,
    pointerEvents: dragState !== null ? 'none' : undefined
  };
};

export const panelDataHelper = (panels: PanelData[], panelData: PanelData, layout: Layout): PanelConstraint & {
  panelSize: number;
  isLastPanel: boolean;
  pivotIndices: PivotIndices;
} => {
  const panelIndex = getPanelDataIndex(panels, panelData);

  const isLastPanel = panelIndex === panels.length - 1;
  const pivotIndices: PivotIndices = isLastPanel
    ? [panelIndex - 1, panelIndex]
    : [panelIndex, panelIndex + 1];
  const panelSize = layout[panelIndex];

  return {
    ...panelData.constraints,
    panelSize,
    isLastPanel,
    pivotIndices,
  };
};
