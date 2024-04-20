import type {
  Dispatch,
  ReactNode,
  ReactElement,
  SetStateAction,
  MutableRefObject,
} from 'react';
import type { Language } from '../i18n/i18n-context';
import type { IconType } from '../shared/icons';

export type ActionType =
  | 'close'
  | 'prev'
  | 'next'
  | 'zoomIn'
  | 'zoomOut'
  | 'rotateLeft'
  | 'rotateRight'
  | 'scaleX'
  | 'scaleY'
  | 'reset';

export type ActionFnType = 'zoomable' | 'changeable' | 'rotatable' | 'flipable';

export type ActionIcon = {
  type: ActionType;
  icon: IconType<unknown>;
  fnType?: ActionFnType;
  pin?: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ScaleFactor = (1 | -1) | number & {};

export type ActionEvents = {
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: (level?: number) => void;
  onZoomOut: (level?: number) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onScaleX: (scale?: ScaleFactor) => void;
  onScaleY: (scale?: ScaleFactor) => void;
  onReset: () => void;
};

export type RenderBtnType = `${ActionType}Btn`;

export type ActionEventKey = keyof ActionEvents;

export type RenderOptions = {
  closeBtn?: (onClose: () => void) => ReactElement;
  prevBtn?: (onPrev: () => void) => ReactElement;
  nextBtn?: (onNext: () => void) => ReactElement;
  zoomInBtn?: (onZoomIn: (level?: number) => void) => ReactElement;
  zoomOutBtn?: (onZoomOut: (level?: number) => void) => ReactElement;
  rotateLeftBtn?: (onRotateLeft: () => void) => ReactElement;
  rotateRightBtn?: (onRotateRight: () => void) => ReactElement;
  scaleXBtn?: (onScaleX: (scale?: ScaleFactor) => void) => ReactElement;
  scaleYBtn?: (onScaleY: (scale?: ScaleFactor) => void) => ReactElement;
  resetBtn?: (onReset: () => void) => ReactElement;
};

export type ViewerProps = {
  open?: boolean;
  lang?: Language;
  prefixCls?: string;
  images?: CanvasImage[];
  activeIndex?: number;
  render?: RenderOptions;
  zoomable?: boolean;
  zoomSpeed?: number;
  scrollZoom?: boolean;
  changeable?: boolean;
  rotatable?: boolean;
  flipable?: boolean;
  maxScale?: number;
  minScale?: number;
  defaultSize?: CanvasImageSize;
  onClose?: () => void;
  onChange?: (activeImage: CanvasImage, activeIndex: number) => void;
};


export type ExcludeKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

export type Position = { x: number, y: number; };

export type Size = { width: number; height: number; };

export type CanvasImageSize = Size;

export type ImageProps = {
  alt?: string;
  key?: string;
  top?: number;
  left?: number;
  info?: (() => ReactNode) | ReactNode;
  rotate?: number;
  scaleX?: number;
  scaleY?: number;
  imgWidth?: number;
  imgHeight?: number;
  className?: string;
};

export type XOR<T1, T2> =
  (T1 & { [k in Exclude<keyof T2, keyof T1>]?: never }) |
  (T2 & { [k in Exclude<keyof T1, keyof T2>]?: never });

export type CanvasImage =
  XOR<
    (ImageProps & Partial<CanvasImageSize> & { src: string; }),
    (ImageProps & Partial<CanvasImageSize> & { render: () => ReactNode; })
  >;

export type CanvasLoadingImage = CanvasImage & {
  loading: boolean;
  loadFailed: boolean;
  index: number;
};

export type GetImageSize = (size: { width: number; height: number; }) => { width: number; height: number; left: number; top: number; };

export type ViewerContextType = {
  images: MutableRefObject<CanvasImage[]>;
  prefixCls?: string;
  activeIndex?: number;
  image: CanvasLoadingImage;
  setImage: Dispatch<SetStateAction<Required<CanvasLoadingImage>>>;
  getImageSize: GetImageSize;
  setToolbarSize: (size: Size) => Size;
  callbackRef: MutableRefObject<ActionEvents & {
    onResize: (e: UIEvent) => void;
  }>;
};

export type RenderCanvasProps = {
  prefixCls?: string;
  onCanvasMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
} & CanvasImage;

