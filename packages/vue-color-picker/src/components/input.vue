<script setup lang="ts">
  import { inject, nextTick } from 'vue';
  import { useClipboard } from '@/utils/use-clipboard';
  import { formatChangedValue } from '@/utils/color-utils';
  import { changeHSVInjectionKey } from './constant';
  import type { ColorType } from '@/utils/color-utils';

  const props = defineProps<{
    type: ColorType;
    value: string;
  }>();

  const changeHSV = inject(changeHSVInjectionKey);

  const { copied, copy } = useClipboard({ source: props.value });

  function valueUpdater(e: Event) {
    const target = e.target as HTMLInputElement;
    const originalValue = props.value;
    const changedValue = formatChangedValue(props.type, target.value, originalValue);
    nextTick(() => {
      changeHSV?.(changedValue.value === originalValue ? undefined : changedValue.hsv);
      target.value = changedValue.value;
    });
  }
</script>

<template>
  <div class="relative w-full h-9 font-roboto">
    <input
      tabindex="0"
      type="text"
      spellcheck="false"
      class="peer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-transparent -tracking-tight text-xs border-none text-left outline-none text-black/80 dark:text-white/90"
      :value="value"
      @change="valueUpdater"
    />
    <div
      class="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none transition-colors duration-300 border-light dark:border-dark peer-hocus:border-[#000] dark:peer-hocus:border-[#fff]"
    >
      <span
        class="absolute w-9 text-xs text-center select-none left-[20%] -translate-x-1/2 -translate-y-[45%] backdrop-blur-lg"
        >{{ type }}
      </span>
    </div>
    <div
      class="w-6 h-6 absolute right-1 top-[.35rem] cursor-pointer transition-colors duration-300 text-black/40 hover:text-black/80 dark:text-white/50 dark:hover:text-white/80"
      @click="copy(value)"
    >
      <svg
        v-if="copied"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        shape-rendering="geometricPrecision"
        viewBox="0 0 24 24"
        height="24"
        width="24"
        class="text-current"
      >
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <svg
        v-else
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        shape-rendering="geometricPrecision"
        viewBox="0 0 24 24"
        height="24"
        width="24"
        class="text-current"
      >
        <path
          d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"
        ></path>
      </svg>
    </div>
  </div>
</template>
