<script setup lang="ts">
  import { computed, onUpdated, provide, ref } from 'vue';
  import { useStore } from './store';
  import { useUUID } from '@/utils';
  import { getSlotId } from '@/utils/panel';
  import { InjectionGroupData } from './constant';
  import { defaultStorage } from '@/utils/storage';
  import type { VNode, Ref } from 'vue';
  import type { Direction, Layout } from './store';
  import type { ResizePanelStorage } from '@/utils/storage';

  const props = withDefaults(
    defineProps<{
      id?: string;
      tagName?: string;
      direction?: Direction;
      autoSaveId?: string | null;
      storage?: ResizePanelStorage;
      keyboardResizeBy?: number | null;
    }>(),
    {
      id: () => useUUID(),
      tagName: 'div',
      direction: 'horizontal',
      autoSaveId: null,
      storage: () => defaultStorage,
      keyboardResizeBy: null,
    },
  );

  const emits = defineEmits<{
    (event: 'layout', layout: Layout): void;
  }>();

  const slots = defineSlots<{
    default: () => VNode[];
  }>();

  const computedSlots = computed(() => {
    const VNodes: VNode[] = [];
    let i: number = 0;
    (slots.default() || []).forEach(slot => {
      const { type } = slot;
      if (type && typeof type === 'object' && (type as any)['name'].startsWith('__Resize')) {
        i = VNodes.length;
        slot['key'] = getSlotId(slot, `${props.id}-${i}`);
      }
      VNodes.push(slot);
    });

    return VNodes;
  });

  const panelGroupRef = ref<HTMLElement | null>(null);

  const onLayout = (layout: Layout) => emits('layout', layout);

  const groupData: GroupData = {
    id: props.id,
    direction: props.direction,
    panelGroupRef,
    onLayout,
    autoSaveId: props.autoSaveId,
    storage: props.storage,
    keyboardResizeBy: props.keyboardResizeBy,
  };

  const store = useStore(groupData);

  provide(InjectionGroupData, groupData);

  defineExpose({
    getLayout: store.getLayout,
    setLayout: store.setLayout,
  });

  onUpdated(() => {
    groupData.id = props.id;
    groupData.direction = props.direction;
    groupData.autoSaveId = props.autoSaveId;
    groupData.storage = props.storage;
  });
</script>

<template>
  <component
    :is="tagName"
    ref="panelGroupRef"
    class="w-full h-full flex"
    :class="[direction === 'vertical' ? 'flex-col' : 'flex-row']"
    data-panel-group
    :data-panel-group-id="id"
  >
    <template v-if="store">
      <template v-for="(slot, i) in computedSlots" :key="slot.key">
        <component :is="slot" :data-index="i" :data-panel-group-id="id"></component>
      </template>
    </template>
  </component>
</template>

<script lang="ts">
  export default { name: '__ResizeWrapper' };
  export type GroupData = {
    id: string;
    autoSaveId: string | null;
    keyboardResizeBy: number | null;
    direction: Direction;
    panelGroupRef: Ref<HTMLElement | null>;
    onLayout: (layout: Layout) => void;
    storage: ResizePanelStorage;
  };
</script>
