
export type Rect = { x: number; y: number; width: number; height: number; };

export const intersects = (rectA: Rect, rectB: Rect, strict: boolean): boolean => {
  if (strict) {
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  }
  return (
    rectA.x <= rectB.x + rectB.width &&
    rectA.x + rectA.width >= rectB.x &&
    rectA.y <= rectB.y + rectB.height &&
    rectA.y + rectA.height >= rectB.y
  );
};