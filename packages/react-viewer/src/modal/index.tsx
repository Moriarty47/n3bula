import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ModalContext } from './modal-context';
import ModalWrapper from './modal-wrapper';
import Portal from '../shared/portal';
import useKeyboard from '../hooks/use-keyboard';
import useBodyScroll from '../hooks/use-body-scroll';
import { KeyCode } from '../shared/keycodes';
import type { PropsWithChildren } from 'react';
import type { ModalConfig, ModalProps } from './types';

export type ModalRefProps = {
  onOpen: () => void;
  onClose: () => void;
};

const Modal = forwardRef<ModalRefProps, PropsWithChildren<ModalProps>>((props, ref) => {
  const {
    open,
    children,
    onClose: customClose,
    portal: customPortal,
    wrapperClassName = '',
    ...restProps
  } = props;
  const portalRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [, setBodyHidden] = useBodyScroll(null, { delayReset: 300 });

  const openModal = () => {
    setVisible(true);
    setBodyHidden(true);
  };

  const closeModal = () => {
    customClose?.();
    setVisible(false);
    setBodyHidden(false);
  };

  const isOpen = open !== undefined ? open : visible;

  const modalConfig = useMemo<ModalConfig>(() => ({
    isOpen,
    onOpen: openModal,
    onClose: closeModal,
    container: portalRef.current,
  }), [visible, portalRef.current]);

  const { bindings } = useKeyboard(() => {
    closeModal();
  }, KeyCode.Escape, { disableGlobalEvent: true });

  useImperativeHandle(ref, () => ({
    onOpen: openModal,
    onClose: closeModal,
  }));

  return (
    <ModalContext.Provider value={modalConfig}>
      <Portal attach={customPortal} ref={portalRef}>
        <ModalWrapper
          visible={isOpen}
          className={wrapperClassName}
          {...restProps}
          {...bindings}
        >
          {children}
        </ModalWrapper>
      </Portal>
    </ModalContext.Provider>
  );
});

export default Modal;
