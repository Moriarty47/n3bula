<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as Icons from '@n3bula/vue-icons';

const theme = ref(true);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err };
  }
};

const camelCase2Dash = (text: string) => {
  const first = text.slice(0, 1).toLowerCase();
  const rest = text.slice(1).replace(/[A-Z]/g, ($0) => `-${$0.toLowerCase()}`);
  return `${first}${rest}`;
};


const onClick = (e: PointerEvent) => {
  const ele = (e.target as HTMLElement | null);
  if (!ele || !ele.classList.contains('icon-box')) return;
  const key = ele.dataset.key;
  if (!key) return;

  copyToClipboard(`import ${key} from '@n3bula/vue-icons/${camelCase2Dash(key)}';`);
};

onMounted(() => {
  document.documentElement.classList.add(theme.value ? 'light' : 'dark');
});

const switchTheme = () => {
  theme.value = !theme.value;
  document.documentElement.classList.replace(
    theme.value ? 'dark' : 'light',
    theme.value ? 'light' : 'dark',
  );
};
</script>

<template>
  <button class="switch" @click="switchTheme">
    change to {{ theme ? 'dark' : 'light' }}
  </button>
  <div class="icons flex-center" @click="onClick">
    <div v-for="(Icon, key) in Icons" class="icon-box flex-center" :data-key="key">
      <span class="icon flex-center">
        <component :is="Icon" />
      </span>
      <small class="name">{{ key }}</small>
    </div>
  </div>
</template>

<style scoped>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.switch {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.icons {
  width: 1110px;
  margin: 24px auto;
  gap: 24px;
  flex-wrap: wrap;

  .icon-box {
    width: 100px;
    height: 100px;
    flex-direction: column;
    justify-content: flex-end;
    border-radius: 8px;
    outline-color: transparent;
    background-color: transparent;
    transition:
      outline-color 0.3s ease-in-out,
      background-color 0.3s ease-in-out;
    cursor: pointer;
  }

  .icon-box:last-child {
    margin: 0 auto 0 0;
  }

  .icon-box:hover {
    background-color: #afafafff;
    outline: 1px solid #333;
  }

  .icon {
    margin-bottom: 8px;
    pointer-events: none;
  }

  .name {
    flex: 0 0 45%;
    width: 100%;
    font-size: 12px;
    text-align: center;
    overflow-wrap: break-word;
    pointer-events: none;
  }
}
</style>
