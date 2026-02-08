<script setup lang="ts">
import svgUrl from "../assets/ring-resize.svg?raw";
</script>

<template>
  <div class="loading-container">
    <div class="loader" v-html="svgUrl"></div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  min-height: 100%;
}

.loader {
  width: 80px;
  height: 80px;
}

.loader :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: #fff;
}
</style>
