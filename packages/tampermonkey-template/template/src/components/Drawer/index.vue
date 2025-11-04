<script setup>
import { computed, inject, onMounted, provide, ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  direction: {
    default: 'left',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  },
  maxSize: {
    type: String,
    default: '400px',
  },
  duration: {
    type: Number,
    default: 300,
  },
});
const emits = defineEmits(['close']);

const drawers = ref(0);
const visible = ref(false);
const parentProps = inject('parentProps', {
  depth: -1,
  drawers,
  direction: null,
});
const depth = computed(() => parentProps.depth + 1);
const overlayStyle = computed(() => ({ zIndex: 1000 + depth.value * 10 }));
const contentStyle = computed(() => ({ zIndex: 1001 + depth.value * 10 }));
const contentStyle2 = computed(() => {
  let style = {};
  switch (props.direction) {
    case 'top':
    case 'bottom':
      style = { '--max-h': props.maxSize };
      break;
    case 'right':
    case 'left':
      style = { '--max-w': props.maxSize };
      break;
  }
  return {
    ...style,
    '--offset': (parentProps.drawers.value - depth.value - 1) * 40,
  };
});

const onBeforeEnter = () => document.body.style.overflow = 'hidden';
const onAfterLeave = () => {
  if (depth.value !== 0) return;
  document.body.style.overflow = null;
};

const closeDrawer = () => emits('close');

watch(() => props.isOpen, newVal => {
  if (newVal) parentProps.drawers.value++;
  else parentProps.drawers.value--;

});

onMounted(() => visible.value = props.isOpen);

provide('parentProps', {
  depth: depth.value,
  drawers: parentProps.drawers,
  direction: props.direction,
});
</script>

<template>
  <Teleport to="#drawer-box">
    <Transition name="drawer" :duration="duration" @before-enter="onBeforeEnter" @after-leave="onAfterLeave">
      <div class="drawer" v-if="isOpen" :class="`from-${direction}`" :style="{
        '--d': `${duration}ms`
      }">
        <div class="drawer__overlay" :style="overlayStyle" />
        <div class="drawer__content" v-click-outside="closeDrawer" :style="{
          ...contentStyle,
          ...contentStyle2,
        }">
          {{ depth }}&nbsp;--&nbsp;
          <span class="drawer__close" @click="closeDrawer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50"
              fill="currentcolor">
              <path
                d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z">
              </path>
            </svg>
          </span>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>