import { assert } from './error';
import { fuzzyNumbersEqual } from './number';
import type { Layout } from '@/components/store';
import type { PanelData } from '@/components/panel.vue';
import type { GroupData } from '@/components/panel-group.vue';

export const callCallbacks = (
  groupData: GroupData,
  panelsArray: PanelData[],
  layout: Layout,
  panelIdToLastNotifiedSize: Map<string, number>
) => {
  groupData.onLayout(layout);

  layout.forEach((size, i) => {
    const panelData = panelsArray[i];
    assert(panelData, `Panel data not found for index ${i}`);

    const { callbacks, constraints, id: panelId } = panelData;
    const { collapsedSize = 0, collapsible } = constraints;

    const lastNotifiedSize = panelIdToLastNotifiedSize.get(panelId);
    if (lastNotifiedSize == null || size !== lastNotifiedSize) {
      panelIdToLastNotifiedSize.set(panelId, size);
      const { onCollapse, onExpand, onResize } = callbacks;

      onResize(size, lastNotifiedSize);

      if (!collapsible) return;

      let isSameSize = fuzzyNumbersEqual(size, collapsedSize);

      if (
        (lastNotifiedSize == null ||
          fuzzyNumbersEqual(lastNotifiedSize, collapsedSize)) &&
        !isSameSize
      ) {
        onExpand();
      }

      if (
        (lastNotifiedSize == null ||
          !fuzzyNumbersEqual(lastNotifiedSize, collapsedSize)) &&
        isSameSize
      ) {
        onCollapse();
      }
    }
  });
};