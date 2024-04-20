import React, { useEffect, useRef } from 'react';
import Modal, { ModalRefProps } from '../modal';
import RenderCanvas from './render-canvas';
import ViewerProvider from './viewer-provider';
import ViewerToolbar from './viewer-toolbar';
import I18nProvider from '../i18n/i18n-provider';
import { ViewerPropsProvider } from './viewer-props-provider';
import type { ViewerProps } from './types';
import { useRegistry } from '../registry/registry-context';

const Viewer = (props: ViewerProps & { outside?: boolean; }) => {
  const {
    open,
    lang = 'zh',
    prefixCls = 'n3bula-viewer',
    onClose,
  } = props;
  const modalRef = useRef<ModalRefProps>(null);
  const { setModalController: getModalController } = useRegistry();

  useEffect(() => {
    getModalController?.(modalRef);
  }, [modalRef]);

  return (
    <I18nProvider lang={lang}>
      <Modal
        ref={modalRef}
        open={open}
        onClose={onClose}
        wrapperClassName={prefixCls}
        contentClassName={`${prefixCls}-content`}
      >
        <ViewerPropsProvider props={props}>
          <ViewerProvider>
            <ViewerToolbar />
            <RenderCanvas />
          </ViewerProvider>
        </ViewerPropsProvider>
      </Modal>
    </I18nProvider>
  );
};

export default Viewer;
