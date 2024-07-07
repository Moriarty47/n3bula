import { intersects } from '@/utils/rect';
import { compareStackingOrder } from '@/utils/stacking-order';
import { getInputType, getResizeEventCoordinate, } from '@/utils/event';
import { resetGlobalCursorStyle, setGlobalCursorStyle } from '@/utils/cursor';
import type { Direction, ResizeEvent } from './store';

export type ResizeHandlerAction = 'down' | 'move' | 'up';
export type ResizeHandlerState = 'drag' | 'hover' | 'inactive';
export type SetResizeHandlerState = (
  action: ResizeHandlerAction,
  isActive: boolean,
  e: ResizeEvent
) => void;

export type PointerHitAreaMargins = {
  coarse: number;
  fine: number;
};

export type ResizeHandlerData = {
  direction: Direction;
  element: HTMLElement;
  hitAreaMargins: PointerHitAreaMargins;
  setResizeHandlerState: SetResizeHandlerState;
};

export const HORIZONTAL_MIN = 0b0001;
export const HORIZONTAL_MAX = 0b0010;
export const VERTICAL_MIN = 0b0100;
export const VERTICAL_MAX = 0b1000;

let isPointerDown = false;
const isCoarsePointer = getInputType() === 'coarse';
const intersectingHandles: ResizeHandlerData[] = [];
const ownerDocumentCounts: Map<Document, number> = new Map();
const panelConstraintFlags: Map<string, number> = new Map();
const registeredResizeHandlers = new Set<ResizeHandlerData>();

export const notifyConstraintsViolation = (resizeHandleId: string, flag: number) => {
  panelConstraintFlags.set(resizeHandleId, flag);
};

export const registerResizeHandle = (
  resizeHandleId: string,
  element: HTMLElement,
  direction: Direction,
  hitAreaMargins: PointerHitAreaMargins,
  setResizeHandlerState: SetResizeHandlerState
) => {
  const { ownerDocument } = element;

  const data: ResizeHandlerData = {
    direction,
    element,
    hitAreaMargins,
    setResizeHandlerState,
  };

  ownerDocumentCounts.set(
    ownerDocument,
    (ownerDocumentCounts.get(ownerDocument) ?? 0) + 1
  );

  registeredResizeHandlers.add(data);

  updateListeners();

  const unregisterResizeHandle = () => {
    panelConstraintFlags.delete(resizeHandleId);
    registeredResizeHandlers.delete(data);

    const count = ownerDocumentCounts.get(ownerDocument) ?? 1;
    ownerDocumentCounts.set(ownerDocument, count - 1);

    updateListeners();

    if (count === 1) {
      ownerDocumentCounts.delete(ownerDocument);
    }
  };

  return unregisterResizeHandle;
};

function updateListeners() {
  ownerDocumentCounts.forEach((_, ownerDocument) => {
    const { body } = ownerDocument;

    body.removeEventListener('contextmenu', pointerUpHandler);
    body.removeEventListener('pointerdown', pointerDownHandler);
    body.removeEventListener('pointerleave', pointerMoveHandler);
    body.removeEventListener('pointermove', pointerMoveHandler);
  });

  window.removeEventListener('pointerup', pointerUpHandler);
  window.removeEventListener('pointercancel', pointerUpHandler);

  if (registeredResizeHandlers.size <= 0) return;

  if (isPointerDown) {
    window.addEventListener('pointerup', pointerUpHandler);
    window.addEventListener('pointercancel', pointerUpHandler);

    ownerDocumentCounts.forEach((count, ownerDocument) => {
      const { body } = ownerDocument;

      if (count <= 0) return;

      body.addEventListener('contextmenu', pointerUpHandler);
      body.addEventListener('pointerleave', pointerMoveHandler);
      body.addEventListener('pointermove', pointerMoveHandler);
    });
  } else {
    ownerDocumentCounts.forEach((count, ownerDocument) => {
      const { body } = ownerDocument;

      if (count <= 0) return;

      body.addEventListener('pointerdown', pointerDownHandler, { capture: true });
      body.addEventListener('pointermove', pointerMoveHandler);
    });
  }
}

function pointerDownHandler(e: ResizeEvent) {
  const { x, y } = getResizeEventCoordinate(e);
  
  isPointerDown = true;
  
  recalculateIntersectingHandles(e.target, x, y);
  updateListeners();

  if (intersectingHandles.length > 0) {
    updateResizeHandlerStates('down', e);

    e.preventDefault();
    e.stopPropagation();
  }
}

function pointerMoveHandler(e: ResizeEvent) {
  const { x, y } = getResizeEventCoordinate(e);

  if (!isPointerDown) {
    // Recalculate intersecting handles whenever the pointer moves, except if it has already been pressed
    // at that point, the handles may not move with the pointer (depending on constraints)
    // but the same set of active handles should be locked until the pointer is released
    recalculateIntersectingHandles(e.target, x, y);
  }

  updateResizeHandlerStates('move', e);

  // Update cursor based on return value(s) from active handles
  updateCursor();

  if (intersectingHandles.length > 0) {
    e.preventDefault();
  }
}

function pointerUpHandler(e: ResizeEvent) {
  panelConstraintFlags.clear();
  isPointerDown = false;

  const { x, y } = getResizeEventCoordinate(e);

  if (intersectingHandles.length > 0) {
    e.preventDefault();
  }

  updateResizeHandlerStates('up', e);
  recalculateIntersectingHandles(e.target, x, y);
  updateCursor();
  updateListeners();
}

function recalculateIntersectingHandles(target: EventTarget | null, x: number, y: number) {
  intersectingHandles.splice(0);

  let targetElement: HTMLElement | null = null;
  if (target instanceof HTMLElement) {
    targetElement = target;
  }

  registeredResizeHandlers.forEach(data => {
    const { element: dragHandleElement, hitAreaMargins } = data;

    const dragHandleRect = dragHandleElement.getBoundingClientRect();
    const { top, right, bottom, left } = dragHandleRect;

    const margin = isCoarsePointer ? hitAreaMargins.coarse : hitAreaMargins.fine;

    const isEventIntersects =
      x >= left - margin &&
      x <= right + margin &&
      y >= top - margin &&
      y <= bottom + margin;

    if (!isEventIntersects) return;

    // TRICKY
    // We listen for pointers events at the root in order to support hit area margins
    // (determining when the pointer is close enough to an element to be considered a "hit")
    // Clicking on an element "above" a handle (e.g. a modal) should prevent a hit though
    // so at this point we need to compare stacking order of a potentially intersecting drag handle,
    // and the element that was actually clicked/touched
    if (
      targetElement !== null &&
      dragHandleElement !== targetElement &&
      !dragHandleElement.contains(targetElement) &&
      !targetElement.contains(dragHandleElement) &&
      // Calculating stacking order has a cost, so we should avoid it if possible
      // That is why we only check potentially intersecting handles,
      // and why we skip if the event target is within the handle's DOM
      compareStackingOrder(targetElement, dragHandleElement) > 0
    ) {
      // If the target is above the drag handle, then we also need to confirm they overlap
      // If they are beside each other (e.g. a panel and its drag handle) then the handle is still interactive
      //
      // It's not enough to compare only the target
      // The target might be a small element inside of a larger container
      // (For example, a SPAN or a DIV inside of a larger modal dialog)
      let currentElement: HTMLElement | null = targetElement;
      let didIntersect = false;
      while (currentElement) {
        if (currentElement.contains(dragHandleElement)) break;
        else if (
          intersects(currentElement.getBoundingClientRect(), dragHandleRect, true)
        ) {
          didIntersect = true;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (didIntersect) return;
    }

    intersectingHandles.push(data);
  });
}

function updateResizeHandlerStates(action: ResizeHandlerAction, e: ResizeEvent) {
  registeredResizeHandlers.forEach(data => {
    data.setResizeHandlerState(action, intersectingHandles.includes(data), e);
  });
}

function updateCursor() {
  let intersectsHorizontal = false;
  let intersectsVertical = false;

  intersectingHandles.forEach(data => {
    if (data.direction === 'horizontal') {
      intersectsHorizontal = true;
    } else {
      intersectsVertical = true;
    }
  });

  let constraintFlags = 0;
  panelConstraintFlags.forEach(flag => constraintFlags |= flag);

  if (intersectsHorizontal && intersectsVertical) {
    setGlobalCursorStyle('intersection', constraintFlags);
  } else if (intersectsHorizontal) {
    setGlobalCursorStyle('horizontal', constraintFlags);
  } else if (intersectsVertical) {
    setGlobalCursorStyle('vertical', constraintFlags);
  } else {
    resetGlobalCursorStyle();
  }
}