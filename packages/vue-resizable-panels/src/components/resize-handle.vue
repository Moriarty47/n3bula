<script setup lang="ts">
  import { inject, onMounted, onUnmounted, ref, useAttrs } from 'vue';
  import { useStore } from './store';
  import { getComponentId } from '@/utils/panel';
  import { InjectionGroupData } from './constant';
  import { registerResizeHandle, ResizeHandlerState } from './resize-handle-registry';
  import type { ResizeEvent } from './store';
  import type { GroupData } from './panel-group.vue';
  import type { PointerHitAreaMargins, ResizeHandlerAction } from './resize-handle-registry';

  const attrs = useAttrs();
  const props = withDefaults(
    defineProps<{
      id?: string;
      tagName?: string;
      disabled?: boolean;
      hitAreaMargins?: PointerHitAreaMargins;
    }>(),
    {
      id: 'handle',
      tagName: 'div',
      disabled: false,
      hitAreaMargins: () => ({ coarse: 15, fine: 5 }),
    },
  );

  const emits = defineEmits<{
    (event: 'focus'): void;
    (event: 'blur'): void;
    (event: 'dragging', isDragging: boolean): void;
  }>();

  const isFocused = ref(false);
  const focusHandler = () => {
    isFocused.value = true;
    emits('focus');
  };
  const blurHandler = () => {
    isFocused.value = false;
    emits('blur');
  };

  const groupData = inject(InjectionGroupData) as GroupData;

  const handleId = getComponentId(groupData.id, props.id, `${attrs['data-index']}`);

  const store = useStore(groupData);

  const handleRef = ref<HTMLDivElement | null>(null);

  const mousedownHandler = (e: MouseEvent) => {
    store.startDragging(handleId, e);
  };

  const mouseupHandler = () => {
    if (!handleRef.value) return;
    handleRef.value.blur();
    store.stopDragging();
  };

  const registerRef = ref<(() => void) | null>(null);
  const activeState = ref<ResizeHandlerState>('inactive');
  const onResize = store.registerResizeHandle({ id: handleId });

  const setResizeHandlerState = (action: ResizeHandlerAction, isActive: boolean, e: ResizeEvent) => {
    if (isActive) {
      switch (action) {
        case 'down': {
          activeState.value = 'drag';
          store.startDragging(handleId, e);
          emits('dragging', true);
          break;
        }
        case 'move': {
          if (activeState.value !== 'drag') {
            activeState.value = 'hover';
          }
          onResize(e);
          break;
        }
        case 'up': {
          activeState.value = 'hover';
          store.stopDragging();
          emits('dragging', false);
          break;
        }
      }
    } else {
      activeState.value = 'inactive';
    }
  };

  const register = () => {
    registerRef.value?.();
    registerRef.value = registerResizeHandle(
      handleId,
      handleRef.value!,
      groupData.direction,
      props.hitAreaMargins,
      setResizeHandlerState,
    );
  };

  const unregister = () => {
    registerRef.value?.();
  };

  onMounted(register);

  onUnmounted(unregister);
</script>

<template>
  <component
    :is="tagName"
    ref="handleRef"
    role="separator"
    tabindex="0"
    class="flex-[0_0_.2rem] outline-none touch-none select-none items-stretch justify-stretch flex transition-[background-color] duration-200 ease-linear data-[resize-handle-active=pointer]:bg-slate-700 data-[resize-handle-active=keyboard]:bg-slate-700"
    @focus="focusHandler"
    @blur="blurHandler"
    @mousedown="mousedownHandler"
    @mouseup="mouseupHandler"
    :data-resize-handle-id="handleId"
    :data-resize-handle-state="activeState"
    :data-resize-handle-active="activeState === 'drag' ? 'pointer' : isFocused ? 'keyboard' : undefined"
  />
</template>

<script lang="ts">
  export default { name: '__ResizeHandler' };
  export type HandleData = {
    id: string;
  };
</script>
