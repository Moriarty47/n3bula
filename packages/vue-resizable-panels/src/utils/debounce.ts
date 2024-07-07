export default function debounce<T extends Function>(fn: T, wait: number = 50): T {
  let timeoutId: NodeJS.Timeout | null = null;

  const callee = function (this: unknown, ...args: any) {
    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, wait);
  };

  return callee as unknown as T;
}
