import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useViewerContext } from './viewer-context';
import { useI18n } from '../i18n/i18n-context';
import useKeyboard from '../hooks/use-keyboard';
import Loading from '../shared/loading';
import { FailedImageIcon } from '../shared/icons';
import { KeyCode } from '../shared/keycodes';
import { clsn } from '@n3bula/utils';
import type { Position } from './types';
import type { CSSProperties } from 'react';


const RenderCanvas = ({
  onCanvasMouseDown = () => { },
}: {
  onCanvasMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const { t } = useI18n();
  const {
    prefixCls,
    image,
    setImage,
    getImageSize,
    callbackRef,
  } = useViewerContext();
  const resizeHandler = callbackRef.current.onResize;

  const prevPosition = useRef<Position>({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const offsetX = position.x - prevPosition.current.x;
    const offsetY = position.y - prevPosition.current.y;
    prevPosition.current = { x: position.x, y: position.y };
    setImage(prev => ({
      ...prev,
      left: (image.left || 0) + offsetX,
      top: (image.top || 0) + offsetY,
    }));
  }, [position]);

  const mouseDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();
    isMouseDownRef.current = true;
    setIsMouseDown(true);
    prevPosition.current = { x: e.clientX, y: e.clientY };
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!isMouseDownRef.current) return;
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const mouseUpHandler = () => {
    isMouseDownRef.current = false;
    setIsMouseDown(false);
  };

  const canvasMouseDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    onCanvasMouseDown(e);
    mouseDownHandler(e);
  };

  useEffect(() => {
    document.addEventListener('click', mouseUpHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);
    window.addEventListener('resize', resizeHandler, false);
    return () => {
      document.removeEventListener('click', mouseUpHandler, false);
      document.removeEventListener('mousemove', mouseMoveHandler, false);
      window.removeEventListener('resize', resizeHandler, false);
    };
  }, [resizeHandler]);

  useKeyboard((e) => {
    const keyCode = e.keyCode || e.which;
    switch (keyCode) {
      case KeyCode.KEY_A:
        return callbackRef.current.onPrev?.();
      case KeyCode.KEY_D:
        return callbackRef.current.onNext?.();
      case KeyCode.UpArrow:
      case KeyCode.KEY_W:
        return callbackRef.current.onZoomIn?.();
      case KeyCode.DownArrow:
      case KeyCode.KEY_S:
        return callbackRef.current.onZoomOut?.();
      case KeyCode.KEY_Q:
        return callbackRef.current.onScaleX?.();
      case KeyCode.KEY_E:
        return callbackRef.current.onScaleY?.();
      case KeyCode.LeftArrow:
        if (e.ctrlKey) return callbackRef.current.onRotateLeft?.();
        return callbackRef.current.onPrev?.();
      case KeyCode.RightArrow:
        if (e.ctrlKey) return callbackRef.current.onRotateRight?.();
        return callbackRef.current.onNext?.();
      case KeyCode.KEY_Z:
        return callbackRef.current.onReset?.();
    }
  }, [
    KeyCode.LeftArrow, KeyCode.KEY_A,
    KeyCode.RightArrow, KeyCode.KEY_D,
    KeyCode.UpArrow, KeyCode.KEY_W,
    KeyCode.DownArrow, KeyCode.KEY_S,
    KeyCode.KEY_Q, KeyCode.KEY_E,
    KeyCode.KEY_Z,
  ]);

  useLayoutEffect(() => {
    if (!nodeRef.current) return;
    const { width, height } = nodeRef.current.getBoundingClientRect();
    setImage(prev => ({
      ...prev,
      ...getImageSize({ width, height }),
      loading: false,
    }));
  }, [image.key]);

  let style: CSSProperties = image.loading ? {} : {
    width: `${image.width}px`,
    height: `${image.height}px`,
    transform: `translateX(${image.left}px) translateY(${image.top}px) rotate(${image.rotate}deg) scaleX(${image.scaleX}) scaleY(${image.scaleY})`,
  };
  const className = clsn(
    image.className,
    !isMouseDownRef.current ? `${prefixCls}-node-transition` : '',
  );

  let imgNode: React.ReactNode = null;
  if (image.render) {
    if (!nodeRef.current) style = {};
    imgNode = (
      <div key={image.key} ref={nodeRef} className={clsn(`${prefixCls}-node`, className)} style={style}>
        {image.render()}
      </div>
    );
  } else if (image.loading) {
    imgNode = (
      <Loading prefixCls={prefixCls!} />
    );
  } else if (image.loadFailed) {
    imgNode = (
      <div className={`${prefixCls}-node-failed`}>
        <FailedImageIcon />
        <span>{t('loadFailed')}</span>
      </div>
    );
  } else if (image.src) {
    imgNode = (
      <img key={image.key}
        src={image.src}
        alt={image.alt}
        style={style}
        className={clsn(`${prefixCls}-image`, className)}
      />
    );
  }

  return (
    <div className={`${prefixCls}-canvas`} onMouseDown={canvasMouseDownHandler} style={{ cursor: isMouseDown ? 'grabbing' : 'grab' }}>
      {imgNode}
    </div>
  );
};

export default RenderCanvas;
