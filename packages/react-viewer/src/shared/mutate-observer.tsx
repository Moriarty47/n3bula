import React, { cloneElement, useLayoutEffect, useRef, useState } from 'react';
import useMutationObserver from '../hooks/use-mutation-observer';

export type MutateObserverProps = {
  options?: MutationObserverInit;
  onMutation?: (mutations: MutationRecord[], observer: MutationObserver) => void;
  children: React.ReactElement;
};

const MutateObserver = ({
  options,
  children,
  onMutation = () => { },
}: MutateObserverProps) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [node, setNode] = useState<HTMLElement | null>();

  useMutationObserver(node, onMutation, options);

  useLayoutEffect(() => {
    setNode(elementRef.current);
  }, []);

  if (!children) return null;

  return cloneElement(children, { ref: elementRef });
};

export default MutateObserver;
