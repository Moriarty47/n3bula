<script setup lang="ts">
  import { inject, onMounted, onUnmounted, onUpdated, useAttrs } from 'vue';
  import { useStore } from './store';
  import { getComponentId } from '@/utils/panel';
  import type { GroupData } from './panel-group.vue';
  import { InjectionGroupData } from './constant';

  const attrs = useAttrs();
  const props = withDefaults(
    defineProps<{
      id?: string;
      order?: number | null;
      tagName?: string;
      minSize?: number;
      maxSize?: number;
      collapsible?: boolean;
      defaultSize?: number;
      collapsedSize?: number;
    }>(),
    {
      id: 'panel',
      order: null,
      tagName: 'div',
    },
  );

  const emits = defineEmits<{
    (event: 'collapse'): void;
    (event: 'expand'): void;
    (event: 'resize', size: number, prevSize?: number): void;
  }>();

  const groupData = inject(InjectionGroupData) as GroupData;

  const store = useStore(groupData);

  const panelId = getComponentId(groupData.id, props.id, `${attrs['data-index']}`);

  const panelData: PanelData = {
    ...props,
    id: panelId,
    order: props.order,
    callbacks: {
      onCollapse: () => emits('collapse'),
      onExpand: () => emits('expand'),
      onResize: (size: number, prevSize?: number) => emits('resize', size, prevSize),
    },
    constraints: {
      minSize: props.minSize,
      maxSize: props.maxSize,
      defaultSize: props.defaultSize,
      collapsible: props.collapsible,
      collapsedSize: props.collapsedSize,
    },
  };

  onMounted(() => {
    store.registerPanel(panelData);
  });
  onUpdated(() => {
    panelData.id = panelId;
    panelData.order = props.order;

    const { constraints } = panelData;
    const prevConstraint = { ...constraints };

    constraints.maxSize = props.maxSize;
    constraints.minSize = props.minSize;
    constraints.defaultSize = props.defaultSize;
    constraints.collapsible = props.collapsible;
    constraints.collapsedSize = props.collapsedSize;

    // If constraints have changed, we should revisit panel sizes.
    // This is uncommon but may happen if people are trying to implement pixel based constraints.
    if (
      prevConstraint.maxSize !== constraints.maxSize ||
      prevConstraint.minSize !== constraints.minSize ||
      prevConstraint.collapsible !== constraints.collapsible ||
      prevConstraint.collapsedSize !== constraints.collapsedSize
    ) {
      store.reevaluatePanelConstraint(panelData, prevConstraint);
    }
  });
  onUnmounted(() => {
    store.unregisterPanel(panelData);
  });

  defineExpose({
    collapse: () => store.collapsePanel(panelData),
    expand: (minSize?: number) => store.expandPanel(panelData, minSize),
    getSize: () => store.getPanelSize(panelData),
    isCollapsed: () => store.isPanelCollapsed(panelData),
    isExpanded: () => store.isPanelExpanded(panelData),
    resize: (size: number) => store.resizePanel(panelData, size),
  });
</script>

<template>
  <component
    :is="tagName"
    class="overflow-hidden flex"
    :style="store.getPanelStyle(panelData)"
    data-panel
    :data-panel-id="panelId"
  >
    <slot />
  </component>
</template>

<script lang="ts">
  export default { name: '__ResizePanel' };

  export type PanelOnCollapse = () => void;
  export type PanelOnExpand = () => void;
  export type PanelOnResize = (size: number, prevSize?: number) => void;
  export type PanelCallbacks = {
    onCollapse: PanelOnCollapse;
    onExpand: PanelOnExpand;
    onResize: PanelOnResize;
  };
  export type PanelConstraint = {
    collapsedSize?: number;
    collapsible?: boolean;
    defaultSize?: number;
    maxSize?: number;
    minSize?: number;
  };
  export type PanelData = {
    id: string;
    callbacks: PanelCallbacks;
    constraints: PanelConstraint;
    order: number | null;
    minSize?: number;
    defaultSize?: number;
  };
</script>
