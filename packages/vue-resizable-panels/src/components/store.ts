import { ref, computed, watch } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { assert } from '@/utils/error';
import { isArrayShallowEqual as compareLayouts } from '@/utils';
import {
  isKeydown,
  isMouseEvent,
  isPointerEvent,
  getResizeEventCursorPosition,
} from '@/utils/event';
import {
  getResizeHandle,
  getPivotIndices,
  getPanelDataIndex,
  getPanelFlexBoxStyle,
  panelDataHelper,
} from '@/utils/panel';
import {
  calculateLayoutByDelta,
  calculateDeltaPercentage,
  validatePanelGroupLayout,
  calculateUnsafeDefaultLayout,
} from '@/utils/calculate';
import {
  HORIZONTAL_MAX,
  HORIZONTAL_MIN,
  VERTICAL_MAX,
  VERTICAL_MIN,
  notifyConstraintsViolation,
} from './resize-handle-registry';
import debounce from '@/utils/debounce';
import { fuzzyCompareNumbers, fuzzyNumbersEqual } from '@/utils/number';
import type { GroupData } from './panel-group.vue';
import type { HandleData } from './resize-handle.vue';
import type { PanelConstraint, PanelData } from './panel.vue';
import { loadPanelGroupState, savePanelGroupState } from '@/utils/serialization';
import { callCallbacks } from '@/utils/callCallbacks';

export type Direction = 'vertical' | 'horizontal';
export type ResizeEvent = KeyboardEvent | MouseEvent | PointerEvent;
export type ResizeHandler = (e: ResizeEvent) => void;

export type Panels = Map<string, PanelData>;

export type Layout = number[];

export type DragState = {
  dragHandleId: string;
  dragHandleRect: DOMRect;
  initialCursorPosition: number;
  initialLayout: number[];
};

const debounceMap = new Map<string, Function>();

export const useStore = (groupData: GroupData) => {
  const createStore = defineStore(`resize-panel-store-${groupData.id}`, () => {

    const layoutRef = ref<Layout>([]);
    const panelsArrayChangedRef = ref<boolean>(false);
    const dragStateRef = ref<DragState | null>(null);

    let prevDelta = 0;
    const panelIdToLastNotifiedSize = new Map<string, number>();
    const panelSizeBeforeCollapse = new Map<string, number>();
    const eagerValues: {
      layout: Layout;
      panelsArray: PanelData[];
    } = {
      layout: layoutRef.value,
      panelsArray: [],
    };

    watch(panelsArrayChangedRef, (newValue) => {
      if (!newValue) return;
      panelsArrayChangedRef.value = false;

      const { autoSaveId, storage } = groupData;
      const { layout: prevLayout, panelsArray } = eagerValues;

      let unsafeLayout: Layout | null = null;

      if (autoSaveId) {
        const state = loadPanelGroupState(autoSaveId, panelsArray, storage);
        if (state) {
          unsafeLayout = state.layout;
        }
      }

      if (!unsafeLayout) {
        unsafeLayout = calculateUnsafeDefaultLayout(panelsArray);
      }

      const nextLayout = validatePanelGroupLayout(unsafeLayout, panelsArray.map(panel => panel.constraints));

      if (!compareLayouts(prevLayout, nextLayout)) {
        layoutRef.value = nextLayout;
        eagerValues.layout = nextLayout;

        callCallbacks(
          groupData,
          panelsArray,
          nextLayout,
          panelIdToLastNotifiedSize,
        );
      }
    });

    watch(layoutRef, (newValue) => {
      if (!groupData.autoSaveId) return;
      if (newValue.length === 0 || newValue.length !== eagerValues.panelsArray.length) return;

      let debouncedSave = debounceMap.get(groupData.autoSaveId);

      if (!debouncedSave) {
        debouncedSave = debounce(savePanelGroupState, 150);
        debounceMap.set(groupData.autoSaveId, debouncedSave);
      }

      // Clone mutable data before passing to the debounced function,
      // else we run the risk of saving an incorrect combination of mutable and immutable values to state.
      debouncedSave(
        groupData.autoSaveId,
        [...eagerValues.panelsArray],
        new Map(panelSizeBeforeCollapse),
        newValue,
        groupData.storage,
      );
    });

    const getLayout = (): Layout => eagerValues.layout;

    const setLayout = (unsafeLayout: Layout) => {
      const { layout: prevLayout, panelsArray } = eagerValues;

      const safeLayout = validatePanelGroupLayout(
        unsafeLayout,
        panelsArray.map(panel => panel.constraints),
      );

      if (!compareLayouts(prevLayout, safeLayout)) {
        layoutRef.value = safeLayout;
        eagerValues.layout = safeLayout;

        callCallbacks(
          groupData,
          panelsArray,
          safeLayout,
          panelIdToLastNotifiedSize,
        );
      }
    };

    const collapsePanel = (panelData: PanelData) => {
      const { layout: prevLayout, panelsArray } = eagerValues;

      if (!panelData.constraints.collapsible) return;

      const panelConstraints = panelsArray.map(panel => panel.constraints);

      const { collapsedSize = 0, panelSize, pivotIndices } = panelDataHelper(panelsArray, panelData, prevLayout);

      assert(
        panelSize != null,
        `Panel size not found for panel "${panelData.id}"`
      );

      if (!fuzzyNumbersEqual(panelSize, collapsedSize)) {
        // Store size before collapse;
        // This is the size that gets restored if the expand() API is used.
        panelSizeBeforeCollapse.set(panelData.id, panelSize);

        const isLastPanel = getPanelDataIndex(panelsArray, panelData) === panelsArray.length - 1;
        const delta = isLastPanel
          ? panelSize - collapsedSize
          : collapsedSize - panelSize;

        const nextLayout = calculateLayoutByDelta({
          delta,
          initialLayout: prevLayout,
          panelConstraints,
          pivotIndices,
          prevLayout,
          trigger: 'imperative-api',
        });

        if (!compareLayouts(prevLayout, nextLayout)) {
          layoutRef.value = nextLayout;
          eagerValues.layout = nextLayout;

          callCallbacks(
            groupData,
            panelsArray,
            nextLayout,
            panelIdToLastNotifiedSize,
          );
        }
      }
    };

    const expandPanel = (panelData: PanelData, minSizeOverride?: number) => {
      const { layout: prevLayout, panelsArray } = eagerValues;

      if (!panelData.constraints.collapsible) return;

      const panelConstraints = panelsArray.map(panel => panel.constraints);

      const {
        collapsedSize = 0,
        panelSize = 0,
        minSize: minSizeFromProps = 0,
        pivotIndices,
      } = panelDataHelper(panelsArray, panelData, prevLayout);

      assert(
        panelSize != null,
        `Panel size not found for panel "${panelData.id}"`
      );

      const minSize = minSizeOverride ?? minSizeFromProps;

      if (fuzzyNumbersEqual(panelSize, collapsedSize)) {
        // Restore this panel to the size it was before it was collapsed, if possible.
        const prevPanelSize = panelSizeBeforeCollapse.get(panelData.id);

        const baseSize = prevPanelSize != null && prevPanelSize >= minSize
          ? prevPanelSize
          : minSize;
        const isLastPanel = getPanelDataIndex(panelsArray, panelData) === panelsArray.length - 1;
        const delta = isLastPanel
          ? panelSize - baseSize
          : baseSize - panelSize;

        const nextLayout = calculateLayoutByDelta({
          delta,
          initialLayout: prevLayout,
          panelConstraints,
          pivotIndices,
          prevLayout,
          trigger: 'imperative-api',
        });

        if (!compareLayouts(prevLayout, nextLayout)) {
          layoutRef.value = nextLayout;
          eagerValues.layout = nextLayout;

          callCallbacks(
            groupData,
            panelsArray,
            nextLayout,
            panelIdToLastNotifiedSize,
          );
        }
      }
    };

    const isPanelCollapsed = (panelData: PanelData) => {
      const { layout, panelsArray } = eagerValues;
      const { collapsedSize = 0, collapsible, panelSize } = panelDataHelper(panelsArray, panelData, layout);

      assert(
        panelSize != null,
        `Panel size not found for panel "${panelData.id}"`
      );

      return collapsible === true && fuzzyNumbersEqual(panelSize, collapsedSize);
    };

    const isPanelExpanded = (panelData: PanelData) => {
      const { layout, panelsArray } = eagerValues;
      const { collapsedSize = 0, collapsible, panelSize } = panelDataHelper(panelsArray, panelData, layout);

      assert(
        panelSize != null,
        `Panel size not found for panel "${panelData.id}"`
      );

      return !collapsible || fuzzyCompareNumbers(panelSize, collapsedSize) > 0;
    };

    const getPanelSize = (panelData: PanelData) => {
      const { layout, panelsArray } = eagerValues;
      const { panelSize } = panelDataHelper(panelsArray, panelData, layout);

      assert(
        panelSize != null,
        `Panel size not found for panel "${panelData.id}"`
      );

      return panelSize;
    };

    const getPanelStyle = computed(() => {
      return (panelData: PanelData) => {
        const panelIndex = getPanelDataIndex(eagerValues.panelsArray, panelData);

        return getPanelFlexBoxStyle({
          layout: layoutRef.value,
          panels: eagerValues.panelsArray,
          dragState: dragStateRef.value,
          panelIndex,
          defaultSize: panelData.defaultSize,
        });
      };
    });

    const registerPanel = (panelData: PanelData) => {
      eagerValues.panelsArray.push(panelData);
      eagerValues.panelsArray.sort(({ order: orderA }, { order: orderB }) => {
        if (orderA == null && orderB == null) return 0;
        else if (orderA == null) return -1;
        else if (orderB == null) return 1;
        else return orderA - orderB;
      });
      panelsArrayChangedRef.value = true;
    };

    const unregisterPanel = (panelData: PanelData) => {
      const panelIndex = getPanelDataIndex(eagerValues.panelsArray, panelData);
      if (panelIndex < 0) return;

      eagerValues.panelsArray.splice(panelIndex, 1);
      panelIdToLastNotifiedSize.delete(panelData.id);
      panelsArrayChangedRef.value = true;
    };

    const registerResizeHandle = (handleData: HandleData) => {
      const resizeHandler: ResizeHandler = (e: ResizeEvent) => {
        e.preventDefault();

        const panelGroupElement = groupData.panelGroupRef.value;
        if (!panelGroupElement) return;

        const { initialLayout } = (dragStateRef.value ?? {}) as DragState;

        const pivotIndices = getPivotIndices(groupData.id, handleData.id, panelGroupElement);

        let delta = calculateDeltaPercentage({
          event: e,
          dragHandleId: handleData.id,
          direction: groupData.direction,
          initialDragState: dragStateRef.value,
          keyboardResizeBy: groupData.keyboardResizeBy,
          panelGroupElement
        });

        if (delta === 0) return;

        const isHorizontal = groupData.direction === 'horizontal';
        if (document.dir === 'rtl' && isHorizontal) {
          delta = -delta;
        }

        const panelConstraints = eagerValues.panelsArray.map(panelData => panelData.constraints);

        const prevLayout = eagerValues.layout;
        const nextLayout = calculateLayoutByDelta({
          delta,
          initialLayout: initialLayout ?? prevLayout,
          panelConstraints,
          pivotIndices,
          prevLayout,
          trigger: isKeydown(e) ? 'keyboard' : 'mouse-or-touch',
        });

        const hasLayoutChanged = !compareLayouts(prevLayout, nextLayout);

        if (isPointerEvent(e) || isMouseEvent(e)) {
          if (prevDelta !== delta) {
            prevDelta = delta;
            if (!hasLayoutChanged) {
              notifyConstraintsViolation(
                handleData.id,
                isHorizontal
                  ? delta < 0 ? HORIZONTAL_MIN : HORIZONTAL_MAX
                  : delta < 0 ? VERTICAL_MIN : VERTICAL_MAX
              );
            } else {
              notifyConstraintsViolation(handleData.id, 0);
            }
          }
        }

        if (hasLayoutChanged) {
          layoutRef.value = nextLayout;
          eagerValues.layout = nextLayout;

          callCallbacks(
            groupData,
            eagerValues.panelsArray,
            nextLayout,
            panelIdToLastNotifiedSize,
          );
        }
      };

      return resizeHandler;
    };

    const startDragging = (dragHandleId: string, e: ResizeEvent) => {
      const panelGroupElement = groupData.panelGroupRef.value;
      if (!panelGroupElement) return;

      const handleElement = getResizeHandle(dragHandleId, panelGroupElement);

      assert(handleElement, `Drag handle element not found for id ${dragHandleId}`);

      const initialCursorPosition = getResizeEventCursorPosition(groupData.direction, e);

      dragStateRef.value = {
        dragHandleId,
        dragHandleRect: handleElement.getBoundingClientRect(),
        initialCursorPosition,
        initialLayout: eagerValues.layout,
      };
    };

    const stopDragging = () => dragStateRef.value = null;

    const resizePanel = (panelData: PanelData, unsafePanelSize: number) => {
      const { layout: prevLayout, panelsArray } = eagerValues;
      const panelConstraints = panelsArray.map(panel => panel.constraints);

      const { panelSize, pivotIndices, isLastPanel } = panelDataHelper(panelsArray, panelData, prevLayout);

      assert(
        panelSize != null,
        `Panel size not found for panel "${panelData.id}"`
      );

      const delta = isLastPanel
        ? panelSize - unsafePanelSize
        : unsafePanelSize - panelSize;

      const nextLayout = calculateLayoutByDelta({
        delta,
        initialLayout: prevLayout,
        panelConstraints,
        pivotIndices,
        prevLayout,
        trigger: 'imperative-api'
      });

      if (!compareLayouts(prevLayout, nextLayout)) {
        layoutRef.value = nextLayout;
        eagerValues.layout = nextLayout;

        callCallbacks(
          groupData,
          panelsArray,
          nextLayout,
          panelIdToLastNotifiedSize,
        );
      }
    };

    const reevaluatePanelConstraint = (panelData: PanelData, prevConstraint: PanelConstraint) => {
      const { layout, panelsArray } = eagerValues;

      const {
        collapsible: prevCollapsible,
        collapsedSize: prevCollapsedSize = 0,
      } = prevConstraint;

      const {
        collapsible: nextCollapsible,
        collapsedSize: nextCollapsedSize = 0,
        minSize: nextMinSize = 0,
        maxSize: nextMaxSize = 100,
      } = panelData.constraints;

      const prevPanelIndex = getPanelDataIndex(panelsArray, panelData);
      const prevPanelSize = layout[prevPanelIndex];

      // It's possible that the panels in this group have changed since the last render
      if (prevPanelSize == null) return;

      if (
        prevCollapsible &&
        nextCollapsible &&
        fuzzyNumbersEqual(prevPanelSize, prevCollapsedSize)
      ) {
        if (!fuzzyNumbersEqual(prevCollapsedSize, nextCollapsedSize)) {
          resizePanel(panelData, nextCollapsedSize);
        }
        // else {
        //   // Stay collapsed
        // }
      } else if (prevPanelSize < nextMinSize) {
        resizePanel(panelData, nextMinSize);
      } else if (prevPanelSize > nextMaxSize) {
        resizePanel(panelData, nextMaxSize);
      }
    };

    return {
      getLayout,
      setLayout,
      collapsePanel,
      expandPanel,
      isPanelCollapsed,
      isPanelExpanded,
      getPanelSize,
      getPanelStyle,
      startDragging,
      stopDragging,
      registerPanel,
      unregisterPanel,
      registerResizeHandle,
      resizePanel,
      reevaluatePanelConstraint,
    };
  });

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(createStore, import.meta.hot));
  }

  return createStore();
};
