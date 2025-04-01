import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ["#app"],
    },
  },
  resolve: {
    alias: {
      "#app": fileURLToPath(
        new URL("./node_modules/nuxt/dist/app", import.meta.url),
      ),
      "#head": fileURLToPath(
        new URL("./node_modules/nuxt/dist/head/runtime", import.meta.url),
      ),
      "#build": fileURLToPath(new URL("./dist", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
