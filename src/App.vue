<script setup lang="ts">
import TaskBar from "./components/TaskBar.vue";
import SplitGrid from "./components/SplitGrid.vue";

const handleButtonClick = (text: string): void => {
  console.log("Button clicked with text:", text);
};

const handleTerminalInput = (input: string): void => {
  console.log("Terminal input:", input);
};
</script>

<template>
  <div class="app-container">
    <TaskBar @button-click="handleButtonClick" />
    <SplitGrid @terminal-input="handleTerminalInput" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
