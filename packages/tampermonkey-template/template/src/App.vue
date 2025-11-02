<script setup>
import { ref, watch } from 'vue';
import { getConfig, setConfig } from './utils';
import Drawer from './components/Drawer.vue';

const config = ref(getConfig());
const direction = ref({
  top: false,
  right: false,
  bottom: false,
  left: false,
});

watch(() => config.value, newVal => {
  setConfig(newVal);
}, {
  deep: true,
});

const openDrawers = (dir) => {
  direction.value[dir] = true;
};
const closeDrawers = (dir) => {
  direction.value[dir] = false;
}

</script>

<template>
  <button class="drawer-button" v-for="dir in Object.keys(direction)" @click="openDrawers(dir)">Open \{{ dir }}
    Drawer</button>
  <Drawer v-for="dir in Object.keys(direction)" :open="direction[dir]" @close="closeDrawers(dir)" :direction="dir">
    tampermonkey \{{ dir }} template \{{ JSON.stringify(config) }}
  </Drawer>
</template>
