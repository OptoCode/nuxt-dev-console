// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["../src/module", "vuetify-nuxt-module"],
  devConsole: {
    enabled: true,
    position: "bottom-left",
    theme: "light",
    height: 600,
    width: 500,
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
});
