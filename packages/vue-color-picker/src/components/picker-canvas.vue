<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import { ColorPicker } from './picker';
  import { clamp, getElementRect } from '@/utils/element';
  import { resetGlobalCursorStyle, setGlobalCursorStyle } from '@/utils/cursor';
  import type { HSV } from '@/utils/color-utils';
  import { hsv2hsl } from '@n3bula/colors';

  const props = defineProps<{
    hsv: HSV;
    size: { width: number; height: number };
    handleSize: number;
  }>();

  let halfHandleSize = props.handleSize / 2;

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const shadowCanvasRef = ref<HTMLCanvasElement | null>(null);

  const dragHandleRef = ref<{ x: number; y: number }>({ x: props.size.width - halfHandleSize, y: -halfHandleSize });

  const hslBg = computed<string>(() => {
    const { s, l } = hsv2hsl(props.hsv);
    return `hsl(var(--hue), ${s}%, ${l}%)`;
  });

  let cp: ColorPicker;

  function draw() {
    cp.draw(props.hsv.h);
  }

  function initial() {
    const canvas = canvasRef.value;
    const shadowCanvas = shadowCanvasRef.value;
    if (!canvas || !shadowCanvas) return;

    cp = new ColorPicker(canvas, shadowCanvas);
    draw();
  }

  onMounted(initial);
  onUnmounted(unregister);

  watch(
    () => props.hsv.h,
    () => draw(),
  );

  watch(
    () => props.handleSize,
    newValue => {
      nextTick(() => {
        halfHandleSize = newValue / 2;
      });
    },
  );

  let canvasRect: DOMRect;
  let maxX: number;
  let maxY: number;

  const getRectInfo = () => {
    canvasRect = getElementRect(canvasRef.value);
    // Calcuate maximum distance
    maxX = canvasRect.width - halfHandleSize;
    maxY = canvasRect.height - halfHandleSize;
  };

  function dragStartHandler(e: MouseEvent) {
    getRectInfo();
    setGlobalCursorStyle('grabbing');

    draggingHandler(e);
    window.addEventListener('mouseup', dragEndHandler);
    window.addEventListener('mousemove', draggingHandler);
  }

  function draggingHandler(e: MouseEvent) {
    e.preventDefault();
    const { clientX, clientY } = e;
    // Distance that has been moved
    let dx = clientX - canvasRect.x - halfHandleSize;
    let dy = clientY - canvasRect.y - halfHandleSize;

    // constrain movement within bounds
    dx = clamp(dx, -halfHandleSize, maxX);
    dy = clamp(dy, -halfHandleSize, maxY);

    dragHandleRef.value = { x: dx, y: dy };

    props.hsv.s = Math.round(((dx + halfHandleSize) / canvasRect.width) * 100);
    props.hsv.v = Math.round(100 - ((dy + halfHandleSize) / canvasRect.height) * 100);
  }

  function dragEndHandler(e: MouseEvent) {
    e.preventDefault();
    resetGlobalCursorStyle();

    unregister();
  }

  function unregister() {
    window.removeEventListener('mouseup', dragEndHandler);
    window.removeEventListener('mousemove', draggingHandler);
  }

  function setDragHandle(s: number, v: number) {
    getRectInfo();
    const x = Math.round((s / 100) * canvasRect.width - halfHandleSize);
    const y = Math.round(((100 - v) / 100) * canvasRect.height - halfHandleSize);
    dragHandleRef.value = { x, y };
  }

  defineExpose({
    setDragHandle,
  });
</script>

<template>
  <div tabindex="0" class="group outline-none color-palette align-top w-full relative h-full select-none">
    <div
      class="absolute rounded-full z-10 w-5 h-5 border-[2px] border-white border-solid cursor-grab will-change-transform shadow-[0_0_2px_white] group-focus:shadow-[0_0_10px_white]"
      @mousedown.stop.prevent="dragStartHandler"
      @contextmenu.stop.prevent
      :style="{
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        backgroundColor: hslBg,
        transform: `translate(${dragHandleRef.x}px,${dragHandleRef.y}px)`,
      }"
    />
    <canvas
      ref="canvasRef"
      class="select-none touch-none block h-full rounded-lg"
      :width="size.width"
      :height="size.height"
      @mousedown.stop.prevent="dragStartHandler"
      @contextmenu.stop.prevent
    ></canvas>
    <canvas
      ref="shadowCanvasRef"
      class="select-none touch-none hidden h-full rounded-lg"
      :width="size.width"
      :height="size.height"
    ></canvas>
  </div>
</template>
