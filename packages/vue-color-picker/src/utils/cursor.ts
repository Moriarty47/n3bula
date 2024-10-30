export type CursorState = 'grab' | 'grabbing' | 'default';

let currentCursorState: string | null = null;
let styleElement: HTMLStyleElement | null = null;

export const setGlobalCursorStyle = (state: CursorState) => {
  if (currentCursorState === state) return;
  currentCursorState = state;

  if (!styleElement) {
    styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
  }

  styleElement.innerHTML = `*{cursor:${state}!important;}`;
};

export const resetGlobalCursorStyle = () => {
  if (!styleElement) return;

  document.head.removeChild(styleElement);
  currentCursorState = null;
  styleElement = null;
};