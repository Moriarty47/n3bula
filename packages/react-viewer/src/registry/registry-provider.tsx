import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { RegistryContext, useRegistry } from './registry-context';
import { isFilterImage, isImageElement } from '../shared/utils';
import { useSSR } from '../hooks/use-ssr';
import { clsn } from '@n3bula/utils';
import NodeMap from './key-map';
import type { MouseEvent as ReactMouseEvent, ReactElement, ReactNode, RefObject } from 'react';
import type { ModalRefProps } from '../modal';

export type RegistryProviderRef = {
  register: () => void;
  unregister: () => void;
};
export type RegistryProviderProps = { children: ReactNode; };

const RegistryProvider = forwardRef<RegistryProviderRef, RegistryProviderProps>(({
  children,
}, ref) => {
  const { isServer } = useSSR();
  const modalController = useRef<ModalRefProps | null>(null);
  const registryParentRef = useRef<HTMLElement | null>(isServer ? null : document.body);
  const nodesRef = useRef<NodeMap<string | HTMLImageElement>>(new NodeMap());
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isServer) return;
    registryParentRef.current = document.body;
  }, [isServer]);

  const registerNode = useCallback((key: string, node: ReactElement) => {
    if (!node) return;
    nodesRef.current.setVNode(key, node);
  }, []);

  const setModalController = useCallback((modalRef: RefObject<ModalRefProps | null>) => {
    modalController.current = modalRef.current;
  }, []);


  const onClick = useCallback((e: ReactMouseEvent<HTMLElement> | MouseEvent) => {
    const dom = (e.target as HTMLElement).closest('[data-v-key]');
    if (!dom) return;
    let idx = nodesRef.current.get(dom as HTMLImageElement);
    if (idx === undefined) {
      const vKey = dom.getAttribute('data-v-key');
      idx = nodesRef.current.getVNodeIndex(vKey);
      if (idx === undefined) return;
    }
    setCurrentIndex(idx);
    modalController.current?.onOpen();
  }, []);

  const value = useMemo(() => ({
    onClick,
    currentNodes: nodesRef.current.toArray(),
    currentIndex,
    registerNode,
    setModalController,
  }), [nodesRef, currentIndex, registerNode, setModalController]);

  const register = useCallback(() => {
    const dom = registryParentRef.current;
    if (!dom) return;
    setTimeout(() => {

      const nodes = Array.from(dom.querySelectorAll('img'));

      const offset = nodesRef.current.size;
      nodes.forEach((node, i) => {
        if (!(isImageElement(node) && isFilterImage(node))) return;
        node.onclick = onClick;
        nodesRef.current.setImageNode(node, offset + i);
      });

      // dom.addEventListener('click', onClick, false);
    }, 10);
  }, [value, isServer]);

  const unregister = useCallback(() => {
    nodesRef.current.clear();
    setCurrentIndex(undefined);
    const dom = registryParentRef.current;
    if (!dom) return;
    // dom.removeEventListener('click', onClick, false);
  }, [value, isServer]);


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
  const { onClick, registerNode } = useRegistry();

  useEffect(() => {
    registerNode?.(vKey, children);
  }, [vKey, children]);

  return React.createElement('div', {
    ...props,
    className: clsn('register-node', props.className),
    children,
    onClick,
    'data-v-key': vKey,
  });
};
