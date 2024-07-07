<script setup lang="ts">
  import { ResizePanelGroup, ResizePanel, ResizeHandle } from '@/components';
  import Preview from '@/preview.vue';
</script>

<template>
  <ResizePanelGroup id="1">
    <ResizePanel :defaultSize="30" :minSize="20">
      <Preview>1</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :minSize="30">
      <Preview>2</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :defaultSize="30" :minSize="20">
      <Preview>3</Preview>
    </ResizePanel>
  </ResizePanelGroup>
  <!-- <ResizePanelGroup id="2" direction="vertical">
    <ResizePanel :maxSize="75">
      <Preview>1</Preview>
    </ResizePanel>
    <ResizeHandle />
    <ResizePanel :maxSize="75">
      <Preview>2</Preview>
    </ResizePanel>
  </ResizePanelGroup> -->
  <!-- <ResizePanelGroup id="3" direction="horizontal">
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
  </ResizePanelGroup> -->
  <!-- <ResizePanelGroup id="6" autoSaveId="persistence">
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
  </ResizePanelGroup> -->
  <!-- <ResizePanelGroup id="7">
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
  </ResizePanelGroup> -->
  <!-- <ResizePanelGroup id="8">
    <div class="bg-orange-400 [writing-mode:tb]">Extra content</div>
    <ResizePanel :defaultSize="15" :maxSize="20" :minSize="15" :collapsedSize="5" :collapsible="true">
      <div class="flex-auto whitespace-pre bg-zinc-800"></div>
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
  </ResizePanelGroup> -->
</template>
