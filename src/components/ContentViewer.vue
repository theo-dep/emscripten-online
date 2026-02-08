<script setup lang="ts">
import { ref } from "vue";

const content = ref<string[]>([]);

const setContent = (text: string) => {
  content.value.push(escapeHtml(text));
};

const clearContent = () => {
  content.value = [];
};

const escapeHtml = (text: string) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

defineExpose({ setContent, clearContent });
</script>

<template>
  <div class="viewer">
    <div class="content">
      <pre v-for="(line, index) in content" :key="index">{{ line }}</pre>
      <div v-if="content.length === 0" class="empty-state">
        Run your Python code to see output here...
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow: auto;
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 0.875rem;
  color: #d4d4d4;
}

.content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.empty-state {
  color: #858585;
  font-style: italic;
}
</style>
