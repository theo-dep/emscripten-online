import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/emscripten-online/",
  plugins: [vue()],
  optimizeDeps: {
    exclude: ["**/deps/**"],
  },
  server: {
    watch: {
      ignored: ["**/deps/**"],
    },
  },
});
