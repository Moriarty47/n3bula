import type { Resolver } from './types';

export class LockResolver {
  interval: number = 100;
  intervalId: NodeJS.Timeout | null = null;
  resolvers: Map<Resolver, number> = new Map();

  init() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.resolve(), this.interval);
  }

  reset() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  add(resolver: Resolver, timeout: number) {
    this.resolvers.set(resolver, Date.now() + timeout);
    this.init();
  }

  remove(resolver: Resolver) {
    this.resolvers.delete(resolver);
  }

  resolve() {
    if (this.resolvers.size === 0) this.reset();

    const now = Date.now();

    for (const [resolver, threshold] of this.resolvers) {
      if (threshold >= now) return;
      this.remove(resolver);
      resolver();
    }
  }
}

export default new LockResolver();
