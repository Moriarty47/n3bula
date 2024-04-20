import { isMac, isMobile as isMobileFn } from '@n3bula/utils';
import { KeyMod } from './keycodes';
import { VNode } from '../registry/registry-context';

export const isMobile = isMobileFn();

export const isChildElement = (
  parent: Element | null | undefined,
  child: Element | null | undefined,
): boolean => {
  if (!parent || !child) return false;
  let node: (Node & ParentNode) | null = child;
  while (node) {
    if (node === parent) return true;
    node = node.parentNode;
  }
  return false;
};

export const getCtrlKeysByPlatform = (): Record<'CtrlCmd' | 'WinCtrl', 'metaKey' | 'ctrlKey'> => {
  return {
    CtrlCmd: isMac() ? 'metaKey' : 'ctrlKey',
    WinCtrl: isMac() ? 'ctrlKey' : 'metaKey',
  };
};

export const getActiveModMap = (
  bindings: number[],
): Record<keyof typeof KeyMod, boolean> => {
  const modBindings = bindings.filter((item: number) => !!KeyMod[item]);
  const activeModMap: Record<keyof typeof KeyMod, boolean> = {
    CtrlCmd: false,
    Shift: false,
    Alt: false,
    WinCtrl: false,
  };
  modBindings.forEach(code => {
    const modKey = KeyMod[code] as keyof typeof KeyMod;
    activeModMap[modKey] = true;
  });
  return activeModMap;
};

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject('[n3bula-viewer]: Error loading image');
    };
    img.src = src;
  });
};

export const isImageElement = (node: unknown): node is HTMLImageElement => !!(node && typeof node === 'object' && (node as HTMLElement).nodeName === 'IMG');

export const isFilterImage = (node: HTMLImageElement) => node.classList.contains('no-register');

export const isVNode = (node: unknown): node is VNode => {
  return !!(node && typeof node === 'object' && 'vKey' in node);
};
