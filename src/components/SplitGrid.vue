<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { monaco, editorWorker } from "../monaco.ts";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { marked } from "marked";
import Split from "split-grid";

// https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046
self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

const editorContainer = ref<HTMLDivElement | null>(null);
const viewerContainer = ref<HTMLDivElement | null>(null);
const terminalContainer = ref<HTMLDivElement | null>(null);
const gutterCol = ref<HTMLDivElement | null>(null);
const gutterRow = ref<HTMLDivElement | null>(null);

let editor: monaco.editor.IStandaloneCodeEditor;
let terminal: Terminal;
let fitAddon: FitAddon;

const emit = defineEmits<{
  (e: "terminal-input", input: string): void;
}>();

const updatePreview = () => {
  const content = editor.getValue();
  if (viewerContainer.value) {
    viewerContainer.value.innerHTML = marked(content) as string;
  }
};

onMounted(async () => {
  await nextTick();

  // Initialize Monaco Editor
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: "# Hello World\n\nThis is a **markdown** editor.",
      language: "markdown",
      theme: "vs-dark",
      automaticLayout: true, // Auto-resize on container changes
    });

    // Initial preview update
    updatePreview();

    // Update HTML viewer when editor content changes
    editor.onDidChangeModelContent(() => {
      updatePreview();
    });
  }

  // Initialize xterm Terminal
  terminal = new Terminal({
    cursorBlink: true,
  });
  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  if (terminalContainer.value) {
    terminal.open(terminalContainer.value);
    fitAddon.fit();
  }

  terminal.writeln("Welcome to the terminal!");
  terminal.onData((data: string) => {
    emit("terminal-input", data);
  });

  // Initialize SplitGrid
  if (gutterCol.value && gutterRow.value) {
    Split({
      columnGutters: [
        {
          track: 1,
          element: gutterCol.value,
        },
      ],
      rowGutters: [
        {
          track: 1,
          element: gutterRow.value,
        },
      ],
      // Resize components during drag
      onDrag: () => {
        editor?.layout();
        fitAddon?.fit();
      },
      // Final resize when drag ends
      onDragEnd: () => {
        editor?.layout();
        fitAddon?.fit();
      },
    });
  }

  // Handle window resize
  const resizeObserver = new ResizeObserver(() => {
    editor?.layout();
    fitAddon?.fit();
  });

  if (editorContainer.value) {
    resizeObserver.observe(editorContainer.value);
  }
  if (terminalContainer.value) {
    resizeObserver.observe(terminalContainer.value);
  }
});
</script>

<template>
  <div class="split-grid">
    <div ref="editorContainer" class="grid-item"></div>
    <div ref="gutterCol" class="gutter-col gutter-col-1"></div>
    <div ref="viewerContainer" class="grid-item viewer"></div>
    <div ref="gutterRow" class="gutter-row gutter-row-1"></div>
    <div ref="terminalContainer" class="grid-item terminal-container"></div>
  </div>
</template>

<style scoped>
.split-grid {
  display: grid;
  grid-template-columns: 1fr 5px 1fr;
  grid-template-rows: 1fr 5px 200px;
  height: 100vh;
  overflow: hidden;
}

.grid-item {
  overflow: auto;
  min-width: 0;
  min-height: 0;
  /* Firefox */
  scrollbar-width: none;
  /* Internet Explorer 10+ */
  -ms-overflow-style: none;
}

.grid-item::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.viewer {
  padding: 1rem;
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.gutter-col {
  /* Only span the first row, not the terminal */
  grid-row: 1;
  cursor: col-resize;
  background-color: #333;
}

.gutter-col:hover {
  background-color: #555;
}

.gutter-col-1 {
  grid-column: 2;
}

.gutter-row {
  /* Span all columns */
  grid-column: 1 / -1;
  cursor: row-resize;
  background-color: #333;
}

.gutter-row:hover {
  background-color: #555;
}

.gutter-row-1 {
  grid-row: 2;
}

.terminal-container {
  /* Span all columns */
  grid-column: 1 / -1;
  grid-row: 3;
  background-color: #000;
  padding: 0;
}

/* Hide the default textarea that xterm creates */
.terminal-container :deep(textarea) {
  display: none !important;
}
</style>
