import type { ReactNode } from 'react';

export type CSSTransitionProps = {
  name?: string;
  visible?: boolean;
  enterTime?: number;
  leaveTime?: number;
  clearTime?: number;
  className?: string;
};

export type ModalProps = {
  open?: boolean;
  prefixCls?: string;
  onClose?: () => void;
  children?: ReactNode;
  portal?: HTMLElement | null;
  wrapperClassName?: string;
  contentClassName?: string;
};

export type ModalConfig = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  container: HTMLElement | null;
};

export type ModalWrapperProps = {
  prefixCls?: string;
  className?: string;
  visible?: boolean;
  contentClassName?: string;
};