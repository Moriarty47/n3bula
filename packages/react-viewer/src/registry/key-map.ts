import type { ReactElement } from 'react';
import type { VNode } from './registry-context';

type MapValue<K> = K extends string ? VNode : number;

class NodeMap<K extends string | HTMLImageElement> {
  map: Map<K, MapValue<K>> = new Map();

  set(key: string, value: VNode): Map<string | HTMLImageElement, number | VNode>;
  set(key: HTMLImageElement, value: number): Map<string | HTMLImageElement, number | VNode>;
  set(key: string | HTMLImageElement, value: VNode | number) {
    return this.map.set(key as K, value as MapValue<K>);
  }

  setVNode(key: string | null, value: ReactElement) {
    if (!key) return;
    const index = this.getVNodeIndex(key) ?? this.size;
    return this.set(key, { children: value, index, key } as VNode);
  }

  setImageNode(key: HTMLImageElement, value: number) {
    const index = this.get(key) ?? value;
    return this.set(key, index);
  }

  get(key: string): VNode | undefined;
  get(key: HTMLImageElement): number | undefined;
  get(key: string | HTMLImageElement): VNode | number | undefined {
    return this.map.get(key as K);
  }

  getVNodeIndex(key: string | null): number | undefined {
    if (!key) return;
    return this.get(key)?.index;
  }

  toArray(): (HTMLImageElement | VNode)[] {
    return Array.from(this.map.entries()).map(([key, value]) => {
      if (typeof key === 'string') {
        return value as VNode;
      }
      return key as HTMLImageElement;
    });
  }

  delete(key: string | HTMLImageElement): boolean {
    return this.map.delete(key as K);
  }

  clear(): void {
    this.map.clear();
  }

  get size() {
    return this.map.size;
  }
}

export default NodeMap;
