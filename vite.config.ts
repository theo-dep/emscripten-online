import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pythonDir = path.resolve(
  __dirname,
  "deps/cpython/cross-build/wasm32-emscripten/build/python",
);

// https://vite.dev/config/
export default defineConfig({
  base: "/emscripten-online/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@python": pythonDir,
    },
  },
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: path.join(pythonDir, "python.wasm"),
          dest: "assets",
        },
      ],
    }),
  ],
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
