<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch, provide } from 'vue';
  import PickerCanvas from './picker-canvas.vue';
  import PanelValue from './panel-value.vue';
  import { getElementRect } from '@/utils/element';
  import { toFixed, type HSV } from '@/utils/color-utils';
  import { resetGlobalCursorStyle, setGlobalCursorStyle } from '@/utils/cursor';
  import { changeHSVInjectionKey } from './constant';

  withDefaults(
    defineProps<{
      size?: { width: number; height: number };
      handleSize?: number;
    }>(),
    {
      size: () => ({ width: 446, height: 224 }),
      handleSize: 20,
    },
  );

  const emits = defineEmits<{
    (emit: 'change', hsv: HSV): void;
  }>();

  const pickerCanvasRef = ref<InstanceType<typeof PickerCanvas> | null>(null);
  const offsetRef = ref<number>(0);
  const gradientBarRef = ref<HTMLDivElement | null>(null);

  const hsvRef = ref<HSV>({ h: 0, s: 100, v: 100, a: 1 });

  watch(hsvRef, newValue => {
    emits('change', { ...newValue });
  });

  provide(changeHSVInjectionKey, (hsv = { ...hsvRef.value }) => {
    hsvRef.value = hsv;
    setHandles(hsv);
  });

  let barOffsetX = 0;
  let maxBarWidth = 0;

  const getRectInfo = () => {
    ({ width: maxBarWidth, left: barOffsetX } = getElementRect(gradientBarRef.value));
  };

  const setDegree = (value: number) => {
    offsetRef.value = value;
    hsvRef.value.h = toFixed((value / maxBarWidth) * 360);
  };

  const setHandles = ({ h, s, v }: HSV) => {
    setDegree(h);
    pickerCanvasRef.value?.setDragHandle(s, v);
  };

  function dragStartHandler(e: MouseEvent) {
    getRectInfo();
    setGlobalCursorStyle('grabbing');

    draggingHandler(e);
    window.addEventListener('mouseup', dragEndHandler);
    window.addEventListener('mousemove', draggingHandler);
  }

  function draggingHandler(e: MouseEvent) {
    const offset = e.clientX - barOffsetX;
    setDegree(offset <= 0 ? 0 : offset >= maxBarWidth ? maxBarWidth : offset);
  }

  function dragEndHandler() {
    resetGlobalCursorStyle();

    unregister();
  }

  function changeBarHandler(e: KeyboardEvent) {
    console.log('e :>>', e);
  }

  function unregister() {
    window.removeEventListener('mouseup', dragEndHandler);
    window.removeEventListener('mousemove', draggingHandler);
  }

  let resizeObserver: ResizeObserver | null = null;
  function initialize() {
    let firstRender = true;
    if (!gradientBarRef.value) return;
    resizeObserver = new ResizeObserver(entries => {
      if (firstRender) {
        firstRender = false;
        getRectInfo();
        return;
      }
      const percent = offsetRef.value / maxBarWidth;
      const rect = entries[0].contentRect;
      maxBarWidth = rect.width;
      setDegree(percent * maxBarWidth);
    });

    resizeObserver.observe(gradientBarRef.value);
  }

  function unmount() {
    resizeObserver?.disconnect();
    unregister();
  }

  onMounted(initialize);
  onUnmounted(unmount);
</script>

<template>
  <div class="color-picker">
    <div
      class="p-4 rounded-lg flex-col-center border-light dark:border-dark text-black/80 dark:text-white/90 w-[486px]"
      :style="{ '--hue': hsvRef.h }"
    >
      <div class="h-full flex-shrink-0 flex-grow-0">
        <PickerCanvas ref="pickerCanvasRef" :size="size" :handleSize="handleSize" :hsv="hsvRef" />
      </div>
      <div class="flex flex-row self-stretch">
        <div
          class="group w-full mx-4 my-0 min-w-[100px] relative h-12 flex items-center outline-none"
          role="slider"
          tabindex="1"
          aria-valuemin="0"
          aria-valuemax="360"
          :aria-valuenow="hsvRef.h"
          @keydown.left.right="changeBarHandler"
        >
          <div
            ref="gradientBarRef"
            class="absolute w-full rounded-full bg-gradient-pattern cursor-pointer"
            :style="{ height: `${handleSize / 2 - 2}px` }"
            @mousedown.stop.prevent="dragStartHandler"
            @contextmenu.stop.prevent
          />
          <div
            class="relative w-[1px] cursor-grab will-change-transform"
            :style="{ height: `${handleSize}px`, transform: `translateX(${offsetRef}px)` }"
          >
            <div
              class="absolute h-full -left-[10px] rounded-full z-10 border-[2px] border-white border-solid transition-shadow duration-300 shadow-[0_0_2px_white] group-focus:shadow-[0_0_10px_white]"
              @mousedown.stop.prevent="dragStartHandler"
              @contextmenu.stop.prevent
              :style="{ width: `${handleSize}px`, backgroundColor: 'hsl(var(--hue),100%,50%)' }"
            ></div>
          </div>
        </div>
      </div>
      <div class="flex flex-row self-stretch">
        <PanelValue :hsv="{ ...hsvRef }" />
      </div>
    </div>
  </div>
</template>
