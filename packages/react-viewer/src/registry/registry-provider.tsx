import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { RegistryContext, useRegistry } from './registry-context';
import { isImageElement } from '../shared/utils';
import { clsn } from '@n3bula/utils';
import NodeMap from './key-map';
import type { ReactElement, ReactNode, RefObject } from 'react';
import type { ModalRefProps } from '../modal';

export type RegistryProviderRef = {
  register: () => void;
  unregister: () => void;
};
export type RegistryProviderProps = { children: ReactNode; };

const RegistryProvider = forwardRef<RegistryProviderRef, RegistryProviderProps>(({
  children,
}, ref) => {

  const modalController = useRef<ModalRefProps | null>(null);
  const registryParentRef = useRef<HTMLElement>(document.body);
  const nodesRef = useRef<NodeMap<string | HTMLImageElement>>(new NodeMap());
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined);

  const registerNode = useCallback((key: string, node: ReactElement) => {
    if (!node) return;
    nodesRef.current.setVNode(key, node);
  }, []);

  const setModalController = useCallback((modalRef: RefObject<ModalRefProps | null>) => {
    modalController.current = modalRef.current;
  }, []);

  const value = useMemo(() => ({
    currentNodes: nodesRef.current.toArray(),
    currentIndex,
    registerNode,
    setModalController,
  }), [nodesRef, currentIndex, registerNode, setModalController]);

  const onClick = useCallback((e: MouseEvent) => {
    const dom = e.target as HTMLElement;
    let idx = nodesRef.current.get(dom as HTMLImageElement);
    if (idx === undefined) {
      const vKey = dom.getAttribute('data-v-key');
      idx = nodesRef.current.getVNodeIndex(vKey);
      if (idx === undefined) return;
    }
    setCurrentIndex(idx);
    modalController.current?.onOpen();
  }, []);

  const register = useCallback(() => {
    const dom = registryParentRef.current;
    if (!dom) return;
    setTimeout(() => {

      const nodes = Array.from(dom.querySelectorAll('img'));

      const offset = nodesRef.current.size;
      nodes.forEach((node, i) => {
        if (!isImageElement(node)) return;
        nodesRef.current.setImageNode(node, offset + i);
      });

      dom.addEventListener('click', onClick, false);
    }, 10);
  }, [value]);

  const unregister = useCallback(() => {
    nodesRef.current.clear();
    setCurrentIndex(undefined);
    const dom = registryParentRef.current;
    if (!dom) return;
    dom.removeEventListener('click', onClick, false);
  }, [value]);


  useImperativeHandle(ref, () => ({
    register,
    unregister,
  }));

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  );
});

export default RegistryProvider;

export const ViewerNode = ({
  children,
  vKey,
  ...props
}: {
  vKey: string;
  children: React.ReactElement;
  className?: string;
}) => {
  const { registerNode } = useRegistry();

  useEffect(() => {
    registerNode?.(vKey, children);
  }, [vKey, children]);

  return React.createElement('div', {
    ...props,
    className: clsn('register-node', props.className),
    children,
    'data-v-key': vKey,
  });
};
