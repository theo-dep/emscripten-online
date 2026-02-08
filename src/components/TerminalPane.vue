<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

const terminalContainer = ref<HTMLDivElement | null>(null);
let terminal: Terminal;
let fitAddon: FitAddon;

const fit = () => {
  fitAddon?.fit();
};

const writeLine = (text: string) => {
  terminal?.writeln(text);
};

const clear = () => {
  terminal?.clear();
};

onMounted(() => {
  terminal = new Terminal({
    cursorBlink: false,
    disableStdin: true,
    theme: {
      background: "#000000",
      foreground: "#d4d4d4",
    },
  });

  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  if (terminalContainer.value) {
    terminal.open(terminalContainer.value);
    fitAddon.fit();
  }

  terminal.writeln("Terminal ready...");

  const resizeObserver = new ResizeObserver(() => {
    fit();
  });

  if (terminalContainer.value) {
    resizeObserver.observe(terminalContainer.value);
  }
});

defineExpose({ fit, writeLine, clear });
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
