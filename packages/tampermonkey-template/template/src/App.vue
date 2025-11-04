<script setup>
import { ref, watch } from 'vue';

import Drawer from '@comps/Drawer/index.vue';
import useDrawer from '@comps/Drawer/use-drawer-state';

import { getConfig, setConfig } from './utils';

const config = ref(getConfig());
const drawer = useDrawer();
const drawer2 = useDrawer();
const drawer3 = useDrawer();

watch(() => config.value, newVal => {
  setConfig(newVal);
}, {
  deep: true,
});
</script>

<template>
  <button class="drawer-button" @click="drawer.open">Open
    Drawer</button>
  <Drawer :isOpen="drawer.visible.value" @close="drawer.close" direction="right">
    tampermonkey template {{ JSON.stringify(config) }}
    <button class="drawer-button" @click="drawer2.open">Open
      Drawer</button>
    <Drawer :isOpen="drawer2.visible.value" @close="drawer2.close" direction="right">
      tampermonkey template 2 {{ JSON.stringify(config) }}
      <button class="drawer-button" @click="drawer3.open">Open
        Drawer</button>
      <Drawer :isOpen="drawer3.visible.value" @close="drawer3.close" direction="right">
        tampermonkey template 3 {{ JSON.stringify(config) }}
      </Drawer>
    </Drawer>
  </Drawer>
</template>
