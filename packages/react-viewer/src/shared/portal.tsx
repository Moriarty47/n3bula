import { forwardRef, useMemo, useEffect, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { getId } from '@n3bula/utils';
import type { ReactNode } from 'react';

export type PortalAttach = HTMLElement | null;

export type PortalProps = {
  id?: string;
  attach?: PortalAttach;
  children?: ReactNode;
};

const getDefaultPortal = (attach?: PortalAttach) => {
  if (typeof attach === 'string') return document.querySelector(attach);
  if (typeof attach === 'object' && attach instanceof HTMLElement) return attach;
  return document.body;
};

const Portal = forwardRef(({
  id = `n3bula-portal-${getId()}`,
  attach = document.body,
  children,
}: PortalProps, ref) => {
  const container = useMemo(() => {
    const ele = document.createElement('div');
    ele.id = id;
    return ele;
  }, []);

  useEffect(() => {
    const attachEle = getDefaultPortal(attach);
    if (!attachEle) return;
    attachEle.appendChild(container);

    return () => {
      attachEle.removeChild(container);
    };
  }, [container, attach]);

  useImperativeHandle(ref, () => container);

  return createPortal(children, container);
});

export default Portal;
