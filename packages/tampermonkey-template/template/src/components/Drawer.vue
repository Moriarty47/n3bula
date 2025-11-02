<script setup>
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  direction: {
    default: 'left',
    validator(value) {
      return ['top', 'right', 'bottom', 'left'].includes(value);
    }
  },
  maxSize: {
    type: String,
    default: '400px',
  },
  duration: {
    type: Number,
    default: 300,
  },
  backgroundColor: {
    type: String,
    default: '#333'
  },
});
const emits = defineEmits(['close']);
const visible = ref(false);
const transitoning = ref(false);
const size = computed(() => {
  switch (props.direction) {
    case 'top':
    case 'bottom':
      return { maxHeight: props.maxSize };
    case 'right':
    case 'left':
      return { maxWidth: props.maxSize };
  }
});

const onBeforeEnter = () => document.body.style.overflow = 'hidden';
const onAfterLeave = () => document.body.style.overflow = null;

const closeDrawer = () => {
  if (props.open && !transitoning.value) emits('close');
};

// watch(() => props.open, newVal => {
//   transitoning.value = true;
//   toggleBackgroundScrolling(newVal);
//   if (newVal) {
//     visible.value = true;
//   } else {
//     setTimeout(() => visible.value = false, props.duration);
//   }
//   setTimeout(() => transitoning.value = false, props.duration);
// });

onMounted(() => visible.value = props.open);
</script>

<template>
  <Transition name="drawer" :duration="duration" @before-enter="onBeforeEnter" @after-leave="onAfterLeave">
    <div class="drawer" v-if="open" :class="{ [`from-${direction}`]: direction }">
      <div class="drawer__overlay" :style="{ transitionDuration: `${duration}ms` }" />
      <div class="drawer__content" v-click-outside="closeDrawer" :style="{
        ...size,
        transitionDuration: `${duration}ms`,
        backgroundColor: backgroundColor,
      }">
        <slot />
      </div>
    </div>
  </Transition>
</template>