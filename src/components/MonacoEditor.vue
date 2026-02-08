<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { monaco as Monaco } from "../monaco.ts";

const props = defineProps<{
  modelValue: string;
  monaco: typeof Monaco;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorContainer = ref<HTMLDivElement | null>(null);
let editor: Monaco.editor.IStandaloneCodeEditor;

const layout = () => {
  editor?.layout();
};

onMounted(() => {
  // Initialize Monaco Editor
  if (editorContainer.value) {
    editor = props.monaco.editor.create(editorContainer.value, {
      value: props.modelValue,
      language: "markdown",
      theme: "vs-dark",
      automaticLayout: true,
    });

    // Update HTML viewer when editor content changes
    editor.onDidChangeModelContent(() => {
      emit("update:modelValue", editor.getValue());
    });
  }

  const resizeObserver = new ResizeObserver(() => {
    layout();
  });

  if (editorContainer.value) {
    resizeObserver.observe(editorContainer.value);
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && editor.getValue() !== newValue) {
      editor.setValue(newValue);
    }
  },
);

defineExpose({ layout });
</script>

<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
