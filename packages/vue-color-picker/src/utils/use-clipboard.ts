import { computed, ref, unref } from 'vue';
import { singletonPromise, withTimeout } from '.';
import type { ComputedRef } from 'vue';

const isClipboardApiSupported = typeof window !== 'undefined' && window.navigator && window.navigator.clipboard;
const isPermissionSupported = typeof window !== 'undefined' && window.navigator && window.navigator.permissions;

const isAllowed = (state?: PermissionState) => state === 'granted' || state === 'prompt';

export function useClipboard<T>({
  source,
  read = false,
  legacy = false,
  duration = 1500,
}: {
  source?: T;
  read?: boolean;
  legacy?: boolean;
  duration?: number;
}) {
  const isSupported = computed(() => isClipboardApiSupported || legacy);
  const permissionRead = getPermissionStatus('clipboard-read');
  const permissionWrite = getPermissionStatus('clipboard-write');

  const text = ref('');
  const copied = ref(false);
  const timeout = withTimeout(() => copied.value = false, duration);

  function updateText() {
    if (isClipboardApiSupported && isAllowed(permissionRead.value)) {
      navigator.clipboard.readText().then((value) => text.value = value);
    } else {
      text.value = document?.getSelection?.()?.toString() ?? '';
    }
  }

  if (isSupported.value && read) {
    window.addEventListener('copy', updateText);
    window.addEventListener('cut', updateText);
  }

  async function copy(value = unref(source)) {
    if (isSupported.value && value != null) {
      if (isClipboardApiSupported && isAllowed(permissionWrite.value)) {
        await navigator.clipboard.writeText(value as string);
      } else {
        legacyCopy(value as string);
      }

      text.value = value as string;
      copied.value = true;
      timeout.start();
    }
  }

  function legacyCopy(value: string) {
    const ta = document.createElement('textarea');
    ta.value = value ?? '';
    ta.style.position = 'absolute';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }

  return {
    text: text as ComputedRef<string>,
    copied: copied as ComputedRef<boolean>,
    copy,
  };
}

function getPermissionStatus(name: 'clipboard-read' | 'clipboard-write') {
  let permissionStatus: PermissionStatus | undefined;
  const state = ref<PermissionState | undefined>();

  const onChange = () => {
    if (!permissionStatus) return;
    state.value = permissionStatus.state;
  };

  const query = singletonPromise(async () => {
    if (!isPermissionSupported) return;

    if (!permissionStatus) {
      try {
        permissionStatus = await navigator.permissions.query({ name: name as PermissionName });
        permissionStatus.addEventListener('change', onChange);
        onChange();
      } catch {
        state.value = 'prompt';
      }
    }
    return permissionStatus;
  });

  query();

  return state;
};