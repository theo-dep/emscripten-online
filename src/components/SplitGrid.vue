<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, nextTick } from "vue";
import Split from "split-grid";

const MonacoEditorLoader = defineAsyncComponent(
  () => import("./MonacoEditorLoader.vue"),
);
const Viewer = defineAsyncComponent(() => import("./Viewer.vue"));
const Terminal = defineAsyncComponent(() => import("./Terminal.vue"));

const editorContent = ref("# Hello World\n\nThis is a **markdown** editor.");

const gutterCol = ref<HTMLDivElement | null>(null);
const gutterRow = ref<HTMLDivElement | null>(null);
const editorRef = ref<InstanceType<typeof MonacoEditorLoader> | null>(null);
const terminalRef = ref<InstanceType<typeof Terminal> | null>(null);

const emit = defineEmits<{
  (e: "terminal-input", input: string): void;
}>();

const handleTerminalInput = (input: string) => {
  emit("terminal-input", input);
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
</script>

<template>
  <div class="split-grid">
    <div class="grid-item">
      <MonacoEditorLoader ref="editorRef" v-model="editorContent" />
    </div>

    <div ref="gutterCol" class="gutter-col gutter-col-1"></div>

    <div class="grid-item">
      <Viewer :content="editorContent" />
    </div>

    <div ref="gutterRow" class="gutter-row gutter-row-1"></div>

    <div class="grid-item terminal-item">
      <Terminal ref="terminalRef" @terminal-input="handleTerminalInput" />
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
