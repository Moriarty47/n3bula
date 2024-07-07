import { HORIZONTAL_MAX, HORIZONTAL_MIN, VERTICAL_MAX, VERTICAL_MIN } from '@/components/resize-handle-registry';

export type CursorState = 'horizontal' | 'vertical' | 'intersection';
type CursorDirection = 'e' | 's' | 'w' | 'n' | 'se' | 'ne' | 'sw' | 'nw' | 'ew' | 'ns';
export type CursorType = `${CursorDirection}-resize` | 'move';

let currentCursorStyle: string | null = null;
let styleElement: HTMLStyleElement | null = null;

export const getCursorStyle = (state: CursorState, constraintFlags: number): CursorType => {
  if (constraintFlags) {
    const horizontalMin = (constraintFlags & HORIZONTAL_MIN) !== 0;
    const horizontalMax = (constraintFlags & HORIZONTAL_MAX) !== 0;
    const verticalMin = (constraintFlags & VERTICAL_MIN) !== 0;
    const verticalMax = (constraintFlags & VERTICAL_MAX) !== 0;

    if (horizontalMin) {
      if (verticalMin) return 'se-resize';
      else if (verticalMax) return 'ne-resize';
      return 'e-resize';
    }
    else if (horizontalMax) {
      if (verticalMin) return 'sw-resize';
      else if (verticalMax) return 'nw-resize';
      return 'w-resize';
    }
    else if (verticalMin) return 's-resize';
    else if (verticalMax) return 'n-resize';
  }

  switch (state) {
    case 'horizontal': return 'ew-resize';
    case 'intersection': return 'move';
    case 'vertical': return 'ns-resize';
  }
};

export const setGlobalCursorStyle = (state: CursorState, constraintFlags: number) => {
  const style = getCursorStyle(state, constraintFlags);
  if (currentCursorStyle === style) return;

  currentCursorStyle = style;

  if (!styleElement) {
    styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
  }

  styleElement.innerHTML = `*{cursor:${style}!important;}`;
};

export const resetGlobalCursorStyle = () => {
  if (!styleElement) return;

  document.head.removeChild(styleElement);
  currentCursorStyle = null;
  styleElement = null;
};