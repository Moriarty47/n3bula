import { useEffect } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, KeyboardEventHandler } from 'react';
import { getActiveModMap, getCtrlKeysByPlatform } from '../shared/utils';
import { KeyMod } from '../shared/keycodes';

export type EventType = 'keydown' | 'keyup' | 'keypress';
export type KeyboardOptions = {
  event?: EventType;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  disableGlobalEvent?: boolean;
  capture?: boolean;
};

export type KeyboardBindings = {
  bindings: {
    onKeyUp?: KeyboardEventHandler;
    onKeyUpCapture?: KeyboardEventHandler;
    onKeyDown?: KeyboardEventHandler;
    onKeyDownCapture?: KeyboardEventHandler;
    onKeyPress?: KeyboardEventHandler;
    onKeyPressCapture?: KeyboardEventHandler;
  };
};

export type KeyboardHandler = (event: ReactKeyboardEvent | KeyboardEvent) => void;

const useKeyboard = (
  handler: KeyboardHandler,
  keyBindings: number[] | number,
  {
    event = 'keydown',
    preventDefault = true,
    stopPropagation = false,
    disableGlobalEvent = false,
    capture = false,
  }: KeyboardOptions = {}
) => {
  const bindings = Array.isArray(keyBindings) ? keyBindings : [keyBindings];
  const activeModMap = getActiveModMap(bindings);
  const keyCode = bindings.filter((k => !KeyMod[k]));
  const { CtrlCmd, WinCtrl } = getCtrlKeysByPlatform();

  const eventHandler = (event: ReactKeyboardEvent | KeyboardEvent) => {
    if (activeModMap.Shift && !event.shiftKey) return;
    if (activeModMap.Alt && !event.altKey) return;
    if (activeModMap.CtrlCmd && !event[CtrlCmd]) return;
    if (activeModMap.WinCtrl && !event[WinCtrl]) return;
    const hitOne = keyCode.find(k => k === event.keyCode);
    if (keyCode && !hitOne) return;
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (preventDefault) {
      event.preventDefault();
    }
    handler && handler(event);
  };

  useEffect(() => {
    if (!disableGlobalEvent) {
      document.addEventListener(event, eventHandler);
    }
    return () => {
      document.removeEventListener(event, eventHandler);
    };
  }, [disableGlobalEvent]);

  const elementBindingHandler = (
    elementEventType: EventType,
    isCapture: boolean = false,
  ) => {
    if (elementEventType !== event) return () => { };
    if (isCapture !== capture) return () => { };
    return (event: ReactKeyboardEvent) => eventHandler(event);
  };

  return {
    bindings: {
      onKeyUp: elementBindingHandler(event, capture),
      onKeyUpCapture: elementBindingHandler(event, capture),
      onKeyDown: elementBindingHandler(event, capture),
      onKeyDownCapture: elementBindingHandler(event, capture),
      onKeyPress: elementBindingHandler(event, capture),
      onKeyPressCapture: elementBindingHandler(event, capture),
    }
  };
};

export default useKeyboard;
