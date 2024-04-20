import { cloneElement, isValidElement, useEffect, useState } from 'react';
import { clsn } from '@n3bula/utils';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import type { CSSTransitionProps } from './types';


const CSSTransition: FC<PropsWithChildren<CSSTransitionProps>> = ({
  name = 'transition',
  enterTime = 60,
  leaveTime = 60,
  clearTime = 60,
  className = '',
  visible = false,
  children,
  ...props
}) => {
  const [classes, setClasses] = useState<string>('');
  const [isRender, setIsRender] = useState<boolean>(visible);

  useEffect(() => {
    const statusClsName = visible ? 'enter' : 'leave';
    const time = visible ? enterTime : leaveTime;
    if (visible && !isRender) {
      setIsRender(true);
    }
    setClasses(`${name}--${statusClsName}`);

    let timer: ReturnType<typeof setTimeout> | null;
    let clearClassesTimer: ReturnType<typeof setTimeout> | null;
    timer = setTimeout(() => {
      setClasses(`${name}--${statusClsName} ${name}--${statusClsName}-active`);
      timer && clearTimeout(timer);
      timer = null;
    }, time);

    clearClassesTimer = setTimeout(() => {
      if (!visible) {
        setClasses('');
        setIsRender(false);
      }
      clearClassesTimer && clearTimeout(clearClassesTimer);
      clearClassesTimer = null;
    }, time + clearTime);

    return () => {
      timer && clearTimeout(timer);
      clearClassesTimer && clearTimeout(clearClassesTimer);
      timer = null;
      clearClassesTimer = null;
    };

  }, [visible, isRender]);



  if (!isValidElement(children) || !isRender) return null;

  return cloneElement(children as ReactElement, {
    ...props,
    className: clsn(children.props.className, className, classes)
  });
};

export default CSSTransition;
