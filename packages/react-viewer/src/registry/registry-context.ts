import React from 'react';
import type { ReactElement, RefObject } from 'react';
import type { ModalRefProps } from '../modal';

export type VNode = { index: number, key: string; children: ReactElement; };


export type RegistryProps = {
  currentNodes: (HTMLImageElement | VNode)[];
  currentIndex?: number;
  registerNode: (key: string, node: ReactElement) => void;
  setModalController: (modalRef: RefObject<ModalRefProps | null>) => void;
};

export const RegistryContext = React.createContext<RegistryProps | undefined>(undefined);

let warningCount = 0;

export const useRegistry = () => {
  const context = React.useContext(RegistryContext);
  if (!context && warningCount === 0) {
    warningCount++;
    console.info('[n3bula-viewer]: running without RegistryProvider');
  }
  return (context || {}) as RegistryProps;
};
