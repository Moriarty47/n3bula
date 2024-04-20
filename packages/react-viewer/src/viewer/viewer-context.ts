import React from 'react';
import type { ViewerContextType } from './types';

export const ViewerContext = React.createContext<ViewerContextType | undefined>(undefined);

export const useViewerContext = () => {
  const context = React.useContext(ViewerContext);
  if (!context) {
    throw new Error('[n3bula-viewer]: useViewerContext must be used within a ViewerProvider');
  }
  return context;
};
