<script setup lang="ts">
import { ResizePanelGroup, ResizePanel, ResizeHandle } from '@/components';
import Preview from '@/preview.vue';
import { onMounted } from 'vue';

function enablePagedScroll({
  container = window,
  duration = 400,
  threshold = 10,
  passive = false
}: {
  container?: HTMLElement | Window;
  duration?: number;
  threshold?: number;
  passive?: boolean;
} = {}) {
  const isWindow = container === window;
  const getScrollTop = () => isWindow ? window.scrollY : (container as HTMLElement).scrollTop;
  const getViewHeight = () => isWindow ? window.innerHeight : (container as HTMLElement).clientHeight;
  let lastTime = 0;

  const scrollToPage = (page: number) => {
    const top = page * getViewHeight();
    container.scrollTo({ top, behavior: 'smooth' });
  };

  const onWheel = (e: WheelEvent) => {
    if (passive) return;
    const now = Date.now();
    // 简单节流，避免快速多次触发
    if (now - lastTime < duration) {
      e.preventDefault();
      return;
    }
    const delta = e.deltaY;
    if (Math.abs(delta) < threshold) return; // 忽略细微滑动
    e.preventDefault();

    const viewH = getViewHeight();
    const currentPage = Math.round(getScrollTop() / viewH);
    const nextPage = delta > 0 ? currentPage + 1 : currentPage - 1;
    lastTime = now;
    scrollToPage(Math.max(0, nextPage));
  };

  const keyMap = {
    'PageDown': 1,
    'PageUp': -1,
    'ArrowDown': 1,
    'ArrowUp': -1,
    'Space': 1
  } as const;
  const onKey = (e: KeyboardEvent) => {
    let dir = keyMap[e.code as keyof typeof keyMap];
    if (e.shiftKey && e.code === 'Space') dir = -1;
    if (!dir) return;
    e.preventDefault();
    const viewH = getViewHeight();
    const currentPage = Math.round(getScrollTop() / viewH);
    const nextPage = Math.max(0, currentPage + dir);
    scrollToPage(nextPage);
  };

  (container as any).addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);

  return () => {
    (container as any).removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKey);
  };
}

onMounted(enablePagedScroll);
</script>

<template>
  <ResizePanelGroup id="1">
    <ResizePanel :defaultSize="30" :minSize="20">
      <Preview>horizontal</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :minSize="30">
      <Preview>horizontal</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :defaultSize="30" :minSize="20">
      <Preview>horizontal</Preview>
    </ResizePanel>
  </ResizePanelGroup>
  <ResizePanelGroup id="2" direction="vertical">
    <ResizePanel :maxSize="75">
      <Preview>vertical</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :maxSize="75">
      <Preview>vertical</Preview>
    </ResizePanel>
  </ResizePanelGroup>
  <ResizePanelGroup id="3" direction="horizontal">
    <ResizePanel :defaultSize="20" :minSize="10">
      <Preview>1</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :minSize="35">
      <ResizePanelGroup id="4" direction="vertical">
        <ResizePanel :defaultSize="35" :minSize="10">
          <Preview>2</Preview>
        </ResizePanel>
        <ResizeHandle />
        <ResizePanel :minSize="10">
          <ResizePanelGroup id="5" direction="horizontal">
            <ResizePanel :minSize="10">
              <Preview>3</Preview>
            </ResizePanel>
            <ResizeHandle />
            <ResizePanel :minSize="10">
              <Preview>4</Preview>
            </ResizePanel>
          </ResizePanelGroup>
        </ResizePanel>
      </ResizePanelGroup>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :defaultSize="20" :minSize="10">
      <Preview>5</Preview>
    </ResizePanel>
  </ResizePanelGroup>
  <ResizePanelGroup id="6" autoSaveId="persistence">
    <ResizePanel>
      <Preview>1</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel>
      <Preview>2</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel>
      <Preview>3</Preview>
    </ResizePanel>
  </ResizePanelGroup>
  <ResizePanelGroup id="7">
    <ResizePanel :defaultSize="50" :minSize="25">
      <div class="flex overflow-hidden w-full h-full bg-zinc-800">
        <code class="block w-full h-full overflow-auto p-4 whitespace-pre">
          function calculateWinner(squares) {<br>
            const lines = [<br>
              [0, 1, 2],<br>
              [3, 4, 5],<br>
              [6, 7, 8],<br>
              [0, 3, 6],<br>
              [1, 4, 7],<br>
              [2, 5, 8],<br>
              [0, 4, 8],<br>
              [2, 4, 6],<br>
            ];<br>
            for (let i = 0; i < lines.length; i++) {<br>
              const [a, b, c] = lines[i];<br>
              if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {<br>
                return squares[a];<br>
              }<br>
            }<br>
            return null;<br>
          }<br>
        </code>
      </div>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :defaultSize="50" :minSize="25">
      <div class="flex overflow-hidden w-full h-full bg-zinc-800">
        <code class="block w-full h-full overflow-auto p-4 whitespace-pre">
          function calculateWinner(squares) {<br>
            const lines = [<br>
              [0, 1, 2],<br>
              [3, 4, 5],<br>
              [6, 7, 8],<br>
              [0, 3, 6],<br>
              [1, 4, 7],<br>
              [2, 5, 8],<br>
              [0, 4, 8],<br>
              [2, 4, 6],<br>
            ];<br>
            for (let i = 0; i < lines.length; i++) {<br>
              const [a, b, c] = lines[i];<br>
              if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {<br>
                return squares[a];<br>
              }<br>
            }<br>
            return null;<br>
          }<br>
        </code>
      </div>
    </ResizePanel>
  </ResizePanelGroup>
  <ResizePanelGroup id="8">
    <div class="bg-orange-400 [writing-mode:tb]">Extra content</div>
    <ResizePanel :defaultSize="15" :maxSize="20" :minSize="15" :collapsedSize="5" :collapsible="true">
      <div class="flex-auto whitespace-pre bg-zinc-800 p-4">
        packages<br />
        &emsp;src<br />
        &emsp;&emsp;main.ts<br />
      </div>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :minSize="50">
      <div class="flex overflow-hidden w-full h-full bg-zinc-800">
        <code class="block w-full h-full overflow-auto p-4 whitespace-pre">
          function calculateWinner(squares) {<br />
          const lines = [<br />
          [0, 1, 2],<br />
          [3, 4, 5],<br />
          [6, 7, 8],<br />
          [0, 3, 6],<br />
          [1, 4, 7],<br />
          [2, 5, 8],<br />
          [0, 4, 8],<br />
          [2, 4, 6],<br />
          ];<br />
          for (let i = 0; i < lines.length; i++) {<br />
          const [a, b, c] = lines[i];<br />
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {<br />
          return squares[a];<br />
          }<br />
          }<br />
          return null;<br />
          }<br />
        </code>
      </div>
    </ResizePanel>
  </ResizePanelGroup>
</template>

<style>
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100%;

  >div {
    width: 100%;
    padding: 24px;
    flex: 0 0 100vh;
  }
}
</style>