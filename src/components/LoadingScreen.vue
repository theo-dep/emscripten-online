<script setup lang="ts">
import svgUrl from "@assets/ring-resize.svg?url";
</script>

<template>
  <div class="loading-container">
    <div class="loader">
      <embed :src="svgUrl" type="image/svg+xml" />
    </div>
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
  filter: brightness(0) invert(1); /** white svg */
}

.loader embed {
  width: 100%;
  height: 100%;
  stroke: #fff;
}
</style>
