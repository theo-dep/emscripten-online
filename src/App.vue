<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";

const TaskBar = defineAsyncComponent(() => import("@components/TaskBar.vue"));
const SplitGrid = defineAsyncComponent(
  () => import("@components/SplitGrid.vue"),
);

const splitGridRef = ref<InstanceType<typeof SplitGrid> | null>(null);

const handleButtonClick = (text: string): void => {
  splitGridRef.value?.runCode(text);
};
</script>

<template>
  <div class="app-container">
    <TaskBar @button-click="handleButtonClick" />
    <SplitGrid ref="splitGridRef" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
