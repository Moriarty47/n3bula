import { useEffect } from 'react';

export type MutationNodes = HTMLElement | HTMLElement[] | undefined | null;

const defaultOptions: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributeFilter: ['class'],
  // attributes: false, // The options object may only set 'attributeFilter' when 'attributes' is true or not present.
};

const normalizeNodes = (nodes: MutationNodes) => {
  if (!nodes) return false;
  if (Array.isArray(nodes)) return nodes.length > 0 ? nodes.filter(n => 'nodeType' in n) : false;
  return [nodes];
};

const useMutationObserver = (
  nodes: MutationNodes,
  callback: MutationCallback,
  options: MutationObserverInit = defaultOptions,
) => {

  useEffect(() => {
    if (!('MutationObserver' in window)) return;

    const nodeList = normalizeNodes(nodes);
    if (!nodeList) return;

    const observer = new window.MutationObserver(callback);
    nodeList.forEach(node => {
      observer?.observe?.(node, options);
    });

    return () => {
      observer.takeRecords();
      observer.disconnect();
    };
  }, [nodes, options]);
};

export default useMutationObserver;
