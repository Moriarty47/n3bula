export class Interval {
  timer: NodeJS.Timeout | null = null;
  constructor(public timeout: number = 1e3) {}  

  set(fn: () => void, timeout?: number) {
    this.clear();
    this.timer = setInterval(() => {
      fn();
    }, timeout ?? this.timeout);
  }

  clear() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }
}
