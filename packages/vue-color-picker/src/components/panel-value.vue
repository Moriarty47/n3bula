<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Input from './input.vue';
  import { getGridClasses } from '@/utils/element';
  import { colorTypes, transformColor } from '@/utils/color-utils';
  import type { ColorType, HSV } from '@/utils/color-utils';

  const props = defineProps<{
    hsv: HSV;
  }>();

  const colors = ref<Record<ColorType, string>>(transformColor({ h: 0, s: 100, v: 100, a: 1 }));

  watch(
    () => props.hsv,
    newValue => {
      colors.value = transformColor(newValue);
    },
  );
</script>

<template>
  <div class="w-full grid grid-cols-6 place-items-center gap-4">
    <div
      v-for="(type, i) in colorTypes"
      :key="type"
      class="w-full text-center"
      :class="getGridClasses(i, colorTypes.length)"
    >
      <Input :type="type" :value="colors[type]" />
    </div>
  </div>
</template>
