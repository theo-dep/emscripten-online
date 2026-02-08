import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/emscripten-online/",
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("monaco-editor/esm/vs/editor")) {
            return "monaco-editor-core";
          }
          if (id.includes("monaco-editor/esm/vs/language")) {
            return "monaco-languages";
          }
          if (id.includes("monaco-editor")) {
            return "monaco-base";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 4000,
  },
  optimizeDeps: {
    include: ["monaco-editor"],
    exclude: ["**/deps/**"],
  },
  server: {
    watch: {
      ignored: ["**/deps/**"],
    },
  },
});
