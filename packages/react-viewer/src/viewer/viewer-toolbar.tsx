import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '../i18n/i18n-context';
import { useViewerContext } from './viewer-context';
import { ToolbarActions } from './toolbar-actions';
import { clsn } from '@n3bula/utils';
import type { I18nConfig } from '../i18n/i18n-context';
import type { ActionIcon, ActionType, ViewerContextType, ViewerProps } from './types';
import { useViewerProps } from './viewer-props-context';

const getActionBtn = (props: ViewerProps, action: ActionIcon, t: I18nConfig['t'], context: ViewerContextType) => {
  const { render = {} } = props;
  const { type, icon: Icon, fnType, pin } = action;

  const fnName = `on${type.slice(0, 1).toUpperCase()}${type.slice(1)}` as `on${Capitalize<ActionType>}`;
  const handler = context.callbackRef.current[fnName] as () => void;

  let showBtn;
  if (fnType) {
    showBtn = props[fnType] === undefined ? true : !!props[fnType];
    if (!showBtn && !pin) return null;
  }
  if (type === 'close') showBtn = true;

  const btnName: `${ActionType}Btn` = `${type}Btn`;
  const renderBtn = render[btnName]?.(handler) as ReactElement;
  const className = clsn('n3bula-viewer-btn', `n3bula-viewer-${type}`, !showBtn && pin ? 'hide' : undefined);
  let btn: JSX.Element;
  if (renderBtn) {
    btn = React.cloneElement(renderBtn, {
      key: btnName,
      className,
    });
  } else {
    btn = (
      <div key={btnName} className={className} role='button' onClick={() => handler()} title={t(type)}>
        <Icon />
      </div>
    );
  }
  return btn;
};

type ToolbarType = ReturnType<typeof getActionBtn>;

const ViewerToolbar = () => {
  const { prefixCls, ...props } = useViewerProps();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const { t, lang } = useI18n();
  const context = useViewerContext();

  useEffect(() => {
    if (!toolbarRef.current) return;
    const width = toolbarRef.current.clientWidth;
    const height = window.innerHeight - toolbarRef.current.offsetTop;
    // height: toolbar top to viewport bottom;
    context.setToolbarSize({ width, height });
  }, [toolbarRef]);


  const [closeElem, prevElem, nextElem, ...restElem] = useMemo(() => {
    const btns = [] as ToolbarType[];

    ToolbarActions.forEach((btn) => {
      btns.push(getActionBtn(props, btn, t, context));
    }, {});

    return btns;
  }, [props.render, props.zoomable, props.flipable, props.rotatable, props.changeable, lang]);

  const { activeIndex = 0, image, images } = context;

  const isMultiple = images.current.length > 1;

  let infoNode;

  if (image.info) {
    infoNode = typeof image.info === 'function' ? image.info() : image.info;
  }

  return (
    <>
      {isMultiple && prevElem}
      {isMultiple && nextElem}
      <div ref={toolbarRef} className={`${prefixCls}-toolbar`}>
        {restElem}
      </div>
      {closeElem}
      <div className={`${prefixCls}-info`}>
        {infoNode}
      </div>
      <div className={`${prefixCls}-pagination`}>
        <i>{activeIndex + 1} of {images.current.length}</i>
      </div>
    </>
  );

};

export default ViewerToolbar;
