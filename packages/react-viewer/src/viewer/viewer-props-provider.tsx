import React from 'react';
import { ViewerPropsContext } from './viewer-props-context';
import type { ViewerProps } from './types';

const defaultProps: ViewerProps = {
  prefixCls: 'n3bula-viewer',
  lang: 'zh',
  open: false,
  images: [],
  activeIndex: 0,
  scrollZoom: true,
  zoomSpeed: 0.3,
  maxScale: 5,
  minScale: 0.2,
  flipable: true,
  zoomable: true,
  rotatable: true,
  changeable: true,
  onClose: undefined,
  onChange: () => { },
  render: {},
  defaultSize: { width: 0, height: 0 },
};


const mergeProps = (props: ViewerProps) =>
  (Object.keys(defaultProps) as (keyof ViewerProps)[]).reduce((newProps, key) => {
    if (key in newProps) {
      newProps[key] = (props[key] ?? newProps[key]);
    }
    return newProps;
  }, { ...defaultProps } as Record<keyof ViewerProps, ViewerProps[keyof ViewerProps]>);

export const ViewerPropsProvider = ({
  props,
  children
}: {
  props: ViewerProps;
  children: React.ReactNode;
}) => {
  const value = mergeProps(props) as Required<ViewerProps>;

  return (
    <ViewerPropsContext.Provider value={value}>
      {children}
    </ViewerPropsContext.Provider>
  );
};