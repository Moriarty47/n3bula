import { isDev } from '.';
import { assert } from './error';
import { getPanelGroup, getResizeHandle } from './panel';
import { getResizeEventCursorPosition, isKeydown } from './event';
import { PERCISION } from '@/components/constant';
import { fuzzyCompareNumbers, fuzzyLayoutEqual, fuzzyNumbersEqual } from './number';
import type { PanelConstraint, PanelData } from '@/components/panel.vue';
import type { Direction, DragState, Layout, ResizeEvent } from '@/components/store';

export const calculateDeltaPercentage = ({
  event,
  dragHandleId,
  direction,
  initialDragState,
  keyboardResizeBy,
  panelGroupElement
}: {
  event: ResizeEvent,
  dragHandleId: string,
  direction: Direction,
  initialDragState: DragState | null,
  keyboardResizeBy: number | null,
  panelGroupElement: HTMLElement;
}): number => {
  if (isKeydown(event)) {
    const isHorizontal = direction === 'horizontal';

    let delta = 0;
    if (event.shiftKey) {
      delta = 100;
    } else if (keyboardResizeBy !== null) {
      delta = keyboardResizeBy;
    } else {
      delta = 10;
    }

    let movement = 0;
    switch (event.key) {
      case 'ArrowUp': movement = isHorizontal ? 0 : -delta; break;
      case 'ArrowRight': movement = isHorizontal ? delta : 0; break;
      case 'ArrowDown': movement = isHorizontal ? 0 : delta; break;
      case 'ArrowLeft': movement = isHorizontal ? -delta : 0; break;
      case 'End': movement = 100; break;
      case 'Home': movement = -100; break;
    }

    return movement;
  }

  if (!initialDragState) return 0;

  return calculateDragOffsetPercentage(event, dragHandleId, direction, initialDragState, panelGroupElement);
};

export const calculateDragOffsetPercentage = (
  event: ResizeEvent,
  dragHandleId: string,
  direction: Direction,
  initialDragState: DragState,
  panelGroupElement: HTMLElement
): number => {
  const isHorizontal = direction === 'horizontal';

  const handleElement = getResizeHandle(dragHandleId, panelGroupElement);

  assert(handleElement, `No resize handle element found for id "${dragHandleId}"`);

  const groupId = handleElement.getAttribute('data-panel-group-id');
  assert(groupId, 'Resize handle element has no group id attribute');

  let { initialCursorPosition } = initialDragState;
  const cursorPosition = getResizeEventCursorPosition(direction, event);

  const groupElement = getPanelGroup(groupId, panelGroupElement);
  assert(groupElement, `No group element found for id "${groupId}"`);

  const groupRect = groupElement.getBoundingClientRect();
  const groupSizeInPixels = isHorizontal ? groupRect.width : groupRect.height;

  const offsetPixels = cursorPosition - initialCursorPosition;

  return (offsetPixels / groupSizeInPixels) * 100;
};

export const calculatePanelSize = (
  panelConstraints: PanelConstraint[],
  panelIndex: number,
  size: number
) => {
  const panelConstraint = panelConstraints[panelIndex];
  assert(panelConstraint != null, `Panel constraints not found for index ${panelIndex}`);

  let {
    collapsedSize = 0,
    collapsible,
    maxSize = 100,
    minSize = 0,
  } = panelConstraint;

  if (fuzzyCompareNumbers(size, minSize) < 0) {
    if (collapsible) {
      const halfwayPoint = (collapsedSize + minSize) / 2;
      size =
        fuzzyCompareNumbers(size, halfwayPoint) < 0 ? collapsedSize : minSize;
    } else {
      size = minSize;
    }
  }

  size = Math.min(maxSize, size);
  size = parseFloat(size.toFixed(PERCISION));

  return size;
};

export const calculateLayoutByDelta = ({
  delta,
  initialLayout,
  panelConstraints,
  pivotIndices,
  prevLayout,
  trigger,
}: {
  delta: number,
  initialLayout: Layout,
  panelConstraints: PanelConstraint[],
  pivotIndices: number[],
  prevLayout: Layout,
  trigger: 'imperative-api' | 'keyboard' | 'mouse-or-touch',
}): Layout => {
  if (fuzzyNumbersEqual(delta, 0)) return initialLayout;

  const nextLayout = [...initialLayout];

  const [prevPivotIndex, nextPivotIndex] = pivotIndices;
  assert(prevPivotIndex != null, 'Invalid previous pivot index');
  assert(nextPivotIndex != null, 'Invalid next pivot index');

  let deltaApplied = 0;

  // A resizing panel affects the panels before or after it.
  //
  // A negative delta means the panel(s) immediately after the resize handle should grow/expand by decreasing its offset.
  // Other panels may also need to shrink/contract (and shift) to make room, depending on the min weights.
  //
  // A positive delta means the panel(s) immediately before the resize handle should "expand".
  // This is accomplished by shrinking/contracting (and shifting) one or more of the panels after the resize handle.

  {
    if (trigger === 'keyboard') {
      {
        // Check if we should expand a collapsed panel
        const index = delta < 0 ? nextPivotIndex : prevPivotIndex;
        const panelConstraint = panelConstraints[index];
        assert(
          panelConstraint,
          `Panel constraints not found for index ${index}`
        );

        const {
          collapsedSize = 0,
          collapsible,
          minSize = 0,
        } = panelConstraint;

        if (collapsible) {
          const prevSize = initialLayout[index];
          assert(
            prevSize != null,
            `Previous layout not found for panel index ${index}`
          );

          if (fuzzyNumbersEqual(prevSize, collapsedSize)) {
            const localDelta = minSize - prevSize;

            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0) {
              delta = delta < 0 ? 0 - localDelta : localDelta;
            }
          }
        }
      }

      {
        // Check if we should collapse a panel at its minimum size
        const index = delta < 0 ? prevPivotIndex : nextPivotIndex;
        const panelConstraint = panelConstraints[index];
        assert(
          panelConstraint,
          `No panel constraints found for index ${index}`
        );

        const {
          collapsedSize = 0,
          collapsible,
          minSize = 0,
        } = panelConstraint;

        if (collapsible) {
          const prevSize = initialLayout[index];
          assert(
            prevSize != null,
            `Previous layout not found for panel index ${index}`
          );

          if (fuzzyNumbersEqual(prevSize, minSize)) {
            const localDelta = prevSize - collapsedSize;

            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0) {
              delta = delta < 0 ? 0 - localDelta : localDelta;
            }
          }
        }
      }
    }
  }

  {
    // Pre-calculate max available delta in the opposite direction of our pivot.
    // This will be the maximum amount we're allowed to expand/contract the panels in the primary direction.
    // If this amount is less than the requested delta, adjust the requested delta.
    // If this amount is greater than the requested delta, that's useful information too–
    // as an expanding panel might change from collapsed to min size.
    const increment = delta < 0 ? 1 : -1;
    let index = delta < 0 ? nextPivotIndex : prevPivotIndex;
    let maxAvailableDelta = 0;

    while (true) {
      const prevSize = initialLayout[index];
      assert(prevSize != null, `Previous layout not found for panel index ${index}`);

      const maxSafeSize = calculatePanelSize(panelConstraints, index, 100);

      const delta = maxSafeSize - prevSize;
      maxAvailableDelta += delta;
      index += increment;

      if (index < 0 || index >= panelConstraints.length) break;
    }

    const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta));
    delta = delta < 0 ? 0 - minAbsDelta : minAbsDelta;
  }

  {
    // Delta added to a panel needs to be subtracted from other panels (within the constraints that those panels allow).
    const pivotIndex = delta < 0 ? prevPivotIndex : nextPivotIndex;
    let index = pivotIndex;
    while (index >= 0 && index < panelConstraints.length) {
      const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied);

      const prevSize = initialLayout[index];
      assert(prevSize != null, `Previous layout not found for panel index ${index}`);

      const unsafeSize = prevSize - deltaRemaining;
      const safeSize = calculatePanelSize(panelConstraints, index, unsafeSize);

      if (!fuzzyNumbersEqual(prevSize, safeSize)) {
        deltaApplied += prevSize - safeSize;

        nextLayout[index] = safeSize;

        if (deltaApplied.toPrecision(3).localeCompare(Math.abs(delta).toPrecision(3), undefined, { numeric: true }) >= 0) break;
      }

      if (delta < 0) index--;
      else index++;
    }
  }

  // If we were unable to resize any of the panels panels, return the previous state.
  // This will essentially bailout and ignore e.g. drags past a panel's boundaries
  if (fuzzyLayoutEqual(prevLayout, nextLayout)) return prevLayout;

  {
    // Now distribute the applied delta to the panels in the other direction
    const pivotIndex = delta < 0 ? nextPivotIndex : prevPivotIndex;

    const prevSize = initialLayout[pivotIndex];
    assert(prevSize != null, `Previous layout not found for panel index ${pivotIndex}`);

    const unsafeSize = prevSize + deltaApplied;
    const safeSize = calculatePanelSize(panelConstraints, pivotIndex, unsafeSize);

    // Adjust the pivot panel before, but only by the amount that surrounding panels were able to shrink/contract.
    nextLayout[pivotIndex] = safeSize;

    // Edge case where expanding or contracting one panel caused another one to change collapsed state
    if (!fuzzyNumbersEqual(safeSize, unsafeSize)) {
      let deltaRemaining = unsafeSize - safeSize;

      const pivotIndex = delta < 0 ? nextPivotIndex : prevPivotIndex;
      let index = pivotIndex;
      while (index >= 0 && index < panelConstraints.length) {
        const prevSize = nextLayout[index];
        assert(prevSize != null, `Previous layout not found for panel index ${index}`);

        const unsafeSize = prevSize + deltaRemaining;
        const safeSize = calculatePanelSize(panelConstraints, index, unsafeSize);

        if (!fuzzyNumbersEqual(prevSize, safeSize)) {
          deltaRemaining -= safeSize - prevSize;
          nextLayout[index] = safeSize;
        }

        if (fuzzyNumbersEqual(deltaRemaining, 0)) break;

        if (delta > 0) index--;
        else index++;
      }
    }
  }

  const totalSize = nextLayout.reduce((total, size) => size + total, 0);

  // If our new layout doesn't add up to 100%, that means the requested delta can't be applied
  // In that case, fall back to our most recent valid layout
  if (!fuzzyNumbersEqual(totalSize, 100)) return prevLayout;

  return nextLayout;
};

export const calculateUnsafeDefaultLayout = (panelDataArray: PanelData[]): Layout => {
  const layout: Layout = Array<number>(panelDataArray.length);

  const panelConstraints = panelDataArray.map(panelData => panelData.constraints);

  let numPanelWithSizes = 0;
  let remainingSize = 100;

  for (let i = 0; i < panelDataArray.length; i += 1) {
    const panelConstraint = panelConstraints[i];
    assert(panelConstraint, `Panel constraints not found for index ${i}`);
    const { defaultSize } = panelConstraint;

    if (defaultSize != null) {
      numPanelWithSizes++;
      layout[i] = defaultSize;
      remainingSize -= defaultSize;
    }
  }

  for (let i = 0; i < panelDataArray.length; i += 1) {
    const panelConstraint = panelConstraints[i];
    assert(panelConstraint, `Panel constraints not found for index ${i}`);
    const { defaultSize } = panelConstraint;

    if (defaultSize != null) continue;

    const numRemainingPanels = panelDataArray.length - numPanelWithSizes;
    const size = remainingSize / numRemainingPanels;

    numPanelWithSizes++;
    layout[i] = size;
    remainingSize -= size;
  }

  return layout;
};

const serializeLayout = (layout: Layout) => layout.map(size => `${size}%`).join(', ');

export const validatePanelGroupLayout = (prevLayout: Layout, panelConstraints: PanelConstraint[]): Layout => {
  const nextLayout = [...prevLayout];
  const nextLayoutTotalSize = nextLayout.reduce((total, current) => total + current, 0);

  // Validate layout expectations
  if (nextLayout.length !== panelConstraints.length) {
    throw new Error(`Invalid ${panelConstraints.length} panel layout: ${serializeLayout(nextLayout)}`);
  } else if (!fuzzyNumbersEqual(nextLayoutTotalSize, 100)) {
    // This is not ideal so we should warn about it, but it may be recoverable in some cases
    // (especially if the amount is small)
    if (isDev) {
      console.warn(`Invalid layout total size: ${serializeLayout(nextLayout)}. Layout normalization will be applied.`);
    }

    for (let i = 0; i < panelConstraints.length; i += 1) {
      const unsafeSize = nextLayout[i];
      assert(unsafeSize != null, `No layout data found for index ${i}`);
      const safeSize = (100 / nextLayoutTotalSize) * unsafeSize;
      nextLayout[i] = safeSize;
    }
  }

  let remainingSize = 0;

  // First pass: Validate the proposed layout given each panel's constraints
  for (let i = 0; i < panelConstraints.length; i += 1) {
    const unsafeSize = nextLayout[i];
    assert(unsafeSize != null, `No layout data found for index ${i}`);
    const safeSize = calculatePanelSize(panelConstraints, i, unsafeSize);
    if (unsafeSize !== safeSize) {
      remainingSize += unsafeSize - safeSize;
      nextLayout[i] = safeSize;
    }
  }

  // If there is additional, left over space, assign it to any panel(s) that permits it
  // (It's not worth taking multiple additional passes to evenly distribute)
  if (!fuzzyNumbersEqual(remainingSize, 0)) {
    for (let i = 0; i < panelConstraints.length; i += 1) {
      const prevSize = nextLayout[i];
      assert(prevSize != null, `No layout data found for index ${i}`);
      const unsafeSize = prevSize + remainingSize;
      const safeSize = calculatePanelSize(panelConstraints, i, unsafeSize);

      if (prevSize !== safeSize) {
        remainingSize -= safeSize - prevSize;
        nextLayout[i] = safeSize;

        // Once we've used up the remainder, bail
        if (fuzzyNumbersEqual(remainingSize, 0)) break;
      }
    }
  }

  return nextLayout;
};