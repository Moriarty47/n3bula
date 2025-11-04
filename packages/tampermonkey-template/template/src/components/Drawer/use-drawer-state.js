import { ref } from 'vue';
import { createContainer } from '@utils';

export default function useDrawerState() {
  const visible = ref(false);
  const open = () => (visible.value = true);
  const close = () => (visible.value = false);
  return {
    visible,
    open,
    close,
  };
}

export const createDrawerBox = () => Promise.resolve(createContainer('drawer-box'));
