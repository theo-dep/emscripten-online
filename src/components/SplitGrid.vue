<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, nextTick } from "vue";
import Split from "split-grid";

const MonacoEditorLoader = defineAsyncComponent(
  () => import("@components/MonacoEditorLoader.vue"),
);
const ContentViewer = defineAsyncComponent(
  () => import("@components/ContentViewer.vue"),
);
const TerminalPane = defineAsyncComponent(
  () => import("@components/TerminalPane.vue"),
);

const PythonRunner = defineAsyncComponent(
  () => import("@components/PythonRunner.vue"),
);

const editorContent = ref(`# Welcome to Python WASM Editor!
import sys

if len(sys.argv) > 1:
    print(f"Hello from {sys.argv[1]}")

# Example: Calculate fibonacci
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")
`);

const gutterCol = ref<HTMLDivElement | null>(null);
const gutterRow = ref<HTMLDivElement | null>(null);
const editorRef = ref<InstanceType<typeof MonacoEditorLoader> | null>(null);
const viewerRef = ref<InstanceType<typeof ContentViewer> | null>(null);
const pythonRunnerRef = ref<InstanceType<typeof PythonRunner> | null>(null);
const terminalRef = ref<InstanceType<typeof TerminalPane> | null>(null);

const handleRun = async (text?: string) => {
  if (!pythonRunnerRef.value?.isReady) {
    terminalRef.value?.writeLine("Python runtime not ready yet...");
    return;
  }

  await pythonRunnerRef.value?.runCode(editorContent.value, text);
};

const handlePythonOutput = (output: string) => {
  viewerRef.value?.setContent(output);
};

const handlePythonError = (error: string) => {
  terminalRef.value?.writeLine(error);
};

const handlePythonReady = () => {
  terminalRef.value?.writeLine("Python runtime ready!");
};

const runCode = (text?: string) => {
  viewerRef.value?.clearContent();
  terminalRef.value?.clear();
  handleRun(text);
};

onMounted(async () => {
  await nextTick();

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
        editorRef.value?.layout();
        terminalRef.value?.fit();
      },
      // Final resize when drag ends
      onDragEnd: () => {
        editorRef.value?.layout();
        terminalRef.value?.fit();
      },
    });
  }
});

defineExpose({ runCode });
</script>

<template>
  <PythonRunner
    ref="pythonRunnerRef"
    @output="handlePythonOutput"
    @error="handlePythonError"
    @ready="handlePythonReady"
  />

  <div class="split-grid">
    <div class="grid-item">
      <MonacoEditorLoader
        ref="editorRef"
        v-model="editorContent"
        @run="handleRun"
      />
    </div>

    <div ref="gutterCol" class="gutter-col gutter-col-1"></div>

    <div class="grid-item">
      <ContentViewer ref="viewerRef" />
    </div>

    <div ref="gutterRow" class="gutter-row gutter-row-1"></div>

    <div class="grid-item terminal-item">
      <TerminalPane ref="terminalRef" />
    </div>
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
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

.terminal-item {
  grid-column: 1 / -1;
  grid-row: 3;
}

.gutter-col {
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
</style>
