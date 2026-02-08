<script setup lang="ts">
import { ref, onMounted } from "vue";
import MonacoEditor from "./MonacoEditor.vue";
import LoadingScreen from "./LoadingScreen.vue";
import type { monaco as Monaco } from "../monaco.ts";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isLoading = ref(true);
const monaco = ref<typeof Monaco | null>(null);
const editorRef = ref<InstanceType<typeof MonacoEditor> | null>(null);

// Lazy load Monaco
const loadMonaco = async () => {
  const { monaco: monacoInstance, editorWorker } = await import("../monaco.ts");

  // https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046
  self.MonacoEnvironment = {
    getWorker() {
      return new editorWorker();
    },
  };

  monaco.value = monacoInstance;
  isLoading.value = false;
};

onMounted(async () => {
  await loadMonaco();
});

const layout = () => {
  editorRef.value?.layout();
};

defineExpose({ layout, isLoading });
</script>

<template>
  <div class="editor-loader">
    <LoadingScreen v-if="isLoading" />
    <MonacoEditor
      v-else
      ref="editorRef"
      :model-value="modelValue"
      :monaco="monaco!"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.editor-loader {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
