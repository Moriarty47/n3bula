export function getElementRect(element?: HTMLElement | null): DOMRect {
  return element?.getBoundingClientRect() || {
    x: 0, y: 0, width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0,
    toJSON() {
      const { toJSON, ...rest } = this;
      return rest;
    }
  };
}

export const clamp = (val: number, min: number, max: number): number => Math.max(min, Math.min(max, val));

const gridClasses: ((i: number) => string)[] = [
  /* 0 */() => '',
  /* 1 */() => 'col-span-6',
  /* 2 */() => 'col-span-3',
  /* 3 */(i) => i === 0 ? 'col-span-6' : 'col-span-3',
  /* 4 */() => 'col-span-3',
  /* 5 */(i) => `${i === 0 ? 'col-span-3' : i === 1 ? 'col-span-3' : 'col-span-2'}`
];

export const getGridClasses = (i: number, length: number) => gridClasses[length](i);