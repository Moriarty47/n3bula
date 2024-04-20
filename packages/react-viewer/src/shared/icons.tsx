import React, { type CSSProperties } from 'react';
import { clsn } from '@n3bula/utils';

type IconProps<T> = React.SVGProps<SVGSVGElement> & T;
export type IconType<T = unknown> = React.FC<IconProps<T>>;

const propsAdapter = <T,>(props: IconProps<T>, clsName?: string) => {
  const { style, className, ...rest } = props;
  const clsNames = clsName ? {
    className: clsn(className || '', clsName)
  } : {
    className
  };

  return {
    ...rest,
    ...clsNames,
    style: {
      color: 'currentColor',
      width: 'var(--w, 32px)',
      height: 'var(--w, 32px)',
      ...style
    },
  };
};

export const SVGWrapper: IconType<{ clsName?: string; }> = ({ children, clsName, ...rest }) => (
  <svg fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' shapeRendering='geometricPrecision' viewBox='0 0 24 24' height='16' width='16'{...propsAdapter(rest, clsName)}>{children}</svg>
);

export const CloseIcon: IconType = (props) => (
  <SVGWrapper {...props} style={{ '--w': '24px' } as CSSProperties}><path d='M18 6L6 18M6 6l12 12'></path></SVGWrapper>
);

export const InfoIcon: IconType = (props) => (
  <SVGWrapper {...props}><circle cx='12' cy='12' r='10' fill=''></circle><path stroke='' d='M12 16v-4M12 8h.01'></path></SVGWrapper>
);


export const ZoomInIcon: IconType = (props) => (
  <SVGWrapper {...props}><circle cx='11' cy='11' r='8'></circle><path d='M21 21l-4.35-4.35M11 8v6M8 11h6'></path></SVGWrapper>
);

export const ZoomOutIcon: IconType = (props) => (
  <SVGWrapper {...props}><circle cx='11' cy='11' r='8'></circle><path d='M21 21l-4.35-4.35M8 11h6'></path></SVGWrapper>
);

export const RotateCwIcon: IconType = (props) => (
  <SVGWrapper {...props}><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"></path></SVGWrapper>
);

export const RotateCcwIcon: IconType = (props) => (
  <SVGWrapper {...props}><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 102.13-9.36L1 10"></path></SVGWrapper>
);

export const FlipXIcon: IconType = (props) => (
  <SVGWrapper {...props}><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 01-4 4H3"></path>
  </SVGWrapper>
);

export const FlipYIcon: IconType = (props) => (
  <SVGWrapper clsName={arrowDirection['RIGHT']} {...props}><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 01-4 4H3"></path></SVGWrapper>
);

export const MaximizeIcon: IconType = (props) => (
  <SVGWrapper {...props}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></SVGWrapper>
);

export const MinimizeIcon: IconType = (props) => (
  <SVGWrapper {...props}><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"></path></SVGWrapper>
);

export const ResetIcon: IconType = (props) => (
  <SVGWrapper {...props}><circle cx="12" cy="12" r="10"></circle><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"></path></SVGWrapper>
);

export const FailedImageIcon: IconType = (props) => (
  <SVGWrapper {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></SVGWrapper>
);

const arrowDirection = {
  UP: 'rotate-0',
  DOWN: 'rotate-180',
  LEFT: '-rotate-90',
  RIGHT: 'rotate-90',
};

export const PrevIcon: IconType = (props) => (
  <SVGWrapper clsName={arrowDirection.LEFT} {...props}><path d='M18 15l-6-6-6 6'></path></SVGWrapper>
);

export const NextIcon: IconType = (props) => (
  <SVGWrapper clsName={arrowDirection.RIGHT} {...props}><path d='M18 15l-6-6-6 6'></path></SVGWrapper>
);

