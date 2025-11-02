<script setup>
import { ref, watch } from 'vue';
import { getConfig, setConfig } from './utils';

const config = ref(getConfig());

watch(() => config.value, newVal => {
  setConfig(newVal);
}, {
  deep: true,
})

</script>

<template>
  <div class="{{packageName}}">
    tampermonkey template \{{JSON.stringify(config)}}
  </div>
</template>
