// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["../src/module", "vuetify-nuxt-module"],
  devServer: {
    port: 3001,
  },
  devConsole: {
    enabled: true,
    position: "bottom-left",
    theme: "light",
    height: 600,
    width: 800,
    maxLogHistory: 100,
    shortcuts: {
      toggle: "ctrl+shift+d",
      clear: "ctrl+l",
    },
    allowProduction: false,
    filters: {
      showTimestamp: true,
      showLogLevel: true,
      minLevel: "info",
    },
  },
  vuetify: {
    moduleOptions: {
      prefixForDefaultIcons: "mdi",
    },
  },
  compatibilityDate: "2025-04-01",
  // Explicitly set app config to ensure app.vue is recognized
  app: {
    rootId: 'nuxt-dev-console-app',
    buildAssetsDir: '/_nuxt/',
  },
  // Ensure Nuxt knows this is not just a module but also an app
  ssr: false,
  // Clear the cache to ensure fresh build
  experimental: {
    reactivityTransform: true,
    // Force a clean build
    payload: {
      clearPayload: true
    }
  }
});
