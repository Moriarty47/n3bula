// Forked from NPM stacking-order@2.0.0
// Background at https://github.com/Rich-Harris/stacking-order/issues/3
// Background at https://github.com/Rich-Harris/stacking-order/issues/6

import { assert } from './error';

const getParent = (node: HTMLElement): ParentNode | null => {
  const { parentNode } = node;
  if (parentNode && parentNode instanceof ShadowRoot) {
    return parentNode.host;
  }
  return parentNode;
};

const getAncestors = (node: HTMLElement | null): HTMLElement[] => {
  const ancestors: HTMLElement[] = [];

  while (node) {
    ancestors.push(node);
    node = getParent(node) as HTMLElement;
  }

  // [node, ...<body>, <html>, document]
  return ancestors;
};

const getZIndex = (node: HTMLElement | null): number => (node && Number(getComputedStyle(node).zIndex)) || 0;

const props =
  /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;

const isFlexItem = (node: HTMLElement): boolean => {
  // @ts-ignore
  const display = getComputedStyle(getParent(node) ?? node).display;
  return display === 'flex' || display === 'inline-flex';
};

const createStackingContext = (node: HTMLElement): boolean => {
  const style = getComputedStyle(node);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
  if (style.position === 'fixed') return true;
  // Forked to fix upstream bug https://github.com/Rich-Harris/stacking-order/issues/3
  // if (
  //   (style.zIndex !== 'auto' && style.position !== 'static') ||
  //   isFlexItem(node)
  // )
  if (style.zIndex !== 'auto' && style.position !== 'static' || isFlexItem(node)) return true;

  if (+style.opacity < 1) return true;
  if ('transform' in style && style.transform !== 'none') return true;
  if ('webkitTransform' in style && style.webkitTransform !== 'none')
    return true;
  if ('mixBlendMode' in style && style.mixBlendMode !== 'normal') return true;
  if ('filter' in style && style.filter !== 'none') return true;
  if ('webkitFilter' in style && style.webkitFilter !== 'none') return true;
  if ('isolation' in style && style.isolation === 'isolate') return true;
  if (props.test(style.willChange)) return true;
  // @ts-expect-error
  if (style.webkitOverflowScrolling === 'touch') return true;

  return false;
};

const findStackingContext = (nodes: HTMLElement[]): HTMLElement | null => {
  let i = nodes.length;

  while (i--) {
    const node = nodes[i];
    assert(node, 'Missing node');
    if (createStackingContext(node)) return node;
  }

  return null;
};

/**
 * Compare which of two nodes appears in front of the other
 * if `a` is in front, returns 1, otherwise returns -1
 */
export const compareStackingOrder = (a: HTMLElement, b: HTMLElement): number => {
  if (a === b) throw new Error('Cannot compare node with itselef');

  const ancestors = { a: getAncestors(a), b: getAncestors(b) };

  let commonAncestor;

  while (ancestors.a.at(-1) === ancestors.b.at(-1)) {
    a = ancestors.a.pop() as HTMLElement;
    b = ancestors.b.pop() as HTMLElement;
    commonAncestor = a;
  }

  assert(commonAncestor, 'Stacking order can only be calculated for elements with a common ancestor');

  const zIndexes = {
    a: getZIndex(findStackingContext(ancestors.a)),
    b: getZIndex(findStackingContext(ancestors.b)),
  };

  if (zIndexes.a === zIndexes.b) {
    const children = commonAncestor.childNodes;
    const furthestAncestors = { a: ancestors.a.at(-1), b: ancestors.b.at(-1) };

    let i = children.length;
    while (i--) {
      const child = children[i];
      if (child === furthestAncestors.a) return 1;
      if (child === furthestAncestors.b) return -1;
    }
  }

  return Math.sign(zIndexes.a - zIndexes.b);
};