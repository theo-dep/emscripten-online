<script setup lang="ts">
import { ref } from "vue";

const lineEditText = ref<string>("Python!");

const emit = defineEmits<{
  (e: "button-click", text: string): void;
}>();

const handleButtonClick = (): void => {
  emit("button-click", lineEditText.value);
};
</script>

<template>
  <div class="taskbar">
    <h1 class="title">Emscripten Online</h1>
    <input
      v-model="lineEditText"
      type="text"
      class="line-edit"
      placeholder="Enter text..."
    />
    <button class="button" @click="handleButtonClick">Execute</button>
  </div>
</template>

<style scoped>
.taskbar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border-bottom: 1px solid #555;
}

.title {
  margin: 0 10px 0 0;
  font-size: 1.2em;
}

.line-edit {
  flex: 1;
  padding: 5px;
  margin-right: 10px;
  background-color: #555;
  color: #fff;
  border: 1px solid #777;
}

.button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #555;
  color: #fff;
  border: 1px solid #777;
}

.button:hover {
  background-color: #777;
}
</style>
