<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

const emit = defineEmits<{
  (e: "terminal-input", input: string): void;
}>();

const terminalContainer = ref<HTMLDivElement | null>(null);
let terminal: Terminal;
let fitAddon: FitAddon;

const fit = () => {
  fitAddon?.fit();
};

onMounted(() => {
  // Initialize xterm Terminal
  terminal = new Terminal({
    cursorBlink: true,
  });
  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  if (terminalContainer.value) {
    terminal.open(terminalContainer.value);
    fitAddon.fit();
  }

  terminal.writeln("Welcome to the terminal!");
  terminal.onData((data: string) => {
    emit("terminal-input", data);
  });

  const resizeObserver = new ResizeObserver(() => {
    fit();
  });

  if (terminalContainer.value) {
    resizeObserver.observe(terminalContainer.value);
  }
});

defineExpose({ fit });
</script>

<template>
  <div ref="terminalContainer" class="terminal-container"></div>
</template>

<style scoped>
.terminal-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  padding: 0;
  overflow: hidden;
}

.terminal-container :deep(textarea) {
  display: none !important;
}
</style>
