<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";

const props = defineProps<{
  content: string;
}>();

const htmlContent = computed(() => {
  return marked(props.content) as string;
});
</script>

<template>
  <div class="viewer" v-html="htmlContent"></div>
</template>

<style scoped>
.viewer {
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: #1e1e1e;
  color: #d4d4d4;
  overflow: auto;
  min-width: 0;
  min-height: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.viewer::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
