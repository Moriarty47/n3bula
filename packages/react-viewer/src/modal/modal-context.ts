import React from 'react';
import type { ModalConfig } from './types';

export const ModalContext = React.createContext<ModalConfig | undefined>(undefined);

export const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('[n3bula-modal]: useModalContext must be used within a ModalProvider');
  }
  return context;
};
