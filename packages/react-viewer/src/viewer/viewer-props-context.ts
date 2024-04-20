import React from 'react';
import type { ViewerProps } from './types';

export const ViewerPropsContext = React.createContext<Required<ViewerProps> | undefined>(undefined);

export const useViewerProps = () => {
  const context = React.useContext(ViewerPropsContext);
  if (!context) {
    throw new Error('[n3bula-viewer]: useViewerProps must be used within a ViewerProvider');
  }
  return context;
};
