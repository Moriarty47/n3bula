import React, { useEffect, useRef } from 'react';
import { useModalContext } from './modal-context';
import CSSTransition from './css-transition';
import { clsn } from '@n3bula/utils';
import { isChildElement } from '../shared/utils';
import type { FC, MouseEvent, PropsWithChildren } from 'react';
import type { ModalWrapperProps } from './types';


const ModalWrapper: FC<PropsWithChildren<ModalWrapperProps>> = ({
  visible = false,
  prefixCls = 'n3bula-modal',
  className = '',
  children,
  contentClassName = '',
  ...props
}) => {
  const { onClose: onClose } = useModalContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const activeElement = document.activeElement;
    const isChild = isChildElement(modalRef.current, activeElement);
    if (isChild) return;
    setTimeout(() => {
      focusRef.current?.focus();
    }, 0);
  }, [visible]);

  const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <CSSTransition name={prefixCls} visible={visible} clearTime={300}>
      <div
        ref={modalRef}
        tabIndex={-1}
        role='dialog'
        className={clsn(`${prefixCls}-wrapper`, className)}
        {...props}
      >
        <div className='hidden' aria-hidden tabIndex={0} ref={focusRef} />
        <div className={`${prefixCls}-layer`} onClick={clickHandler} />
        <div className={clsn(`${prefixCls}-content`, contentClassName)}>
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};

export default ModalWrapper;
