import type { Direction, ResizeEvent } from '@/components/store';

export const isKeydown = (e: ResizeEvent): e is KeyboardEvent => e.type === 'keydown';

export const isMouseEvent = (e: ResizeEvent): e is MouseEvent => e.type.startsWith('mouse');

export const isPointerEvent = (e: ResizeEvent): e is PointerEvent => e.type.startsWith('pointer');

export const getResizeEventCoordinate = (e: ResizeEvent): { x: number; y: number; } => {
  if (isPointerEvent(e)) {
    if (e.isPrimary) return { x: e.clientX, y: e.clientY };
  } else if (isMouseEvent(e)) {
    return { x: e.clientX, y: e.clientY };
  }
  return { x: Infinity, y: Infinity };
};

export const getResizeEventCursorPosition = (direction: Direction, e: ResizeEvent): number => {
  const isHorizontal = direction === 'horizontal';
  const { x, y } = getResizeEventCoordinate(e);
  return isHorizontal ? x : y;
};

export const getInputType = (): 'coarse' | 'fine' | undefined => {
  if (typeof matchMedia === 'function') {
    return matchMedia('(pointer:coarse)').matches ? 'coarse' : 'fine';
  }
};