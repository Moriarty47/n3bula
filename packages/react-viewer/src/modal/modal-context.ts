import React from 'react';
import type { ModalConfig } from './types';

export const ModalContext = React.createContext<ModalConfig | undefined>(undefined);

export const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('[Modal]: useModalContext must be used within a ModalProvider');
  }
  return context;
};
