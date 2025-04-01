// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@opto-code/nuxt-dev-console"],

  devConsole: {
    // Basic configuration for testing
    enabled: true,
    position: "bottom-left",
    theme: "light",
    height: 300,
    width: 400,
  },

  vuetify: {
    moduleOptions: {
      prefixForDefaultIcons: "mdi",
    },
    vuetifyOptions: {
      icons: {
        defaultSet: "mdi",
      },
    },
  },

  compatibilityDate: "2025-04-01",
});