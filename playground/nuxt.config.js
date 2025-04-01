// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["../src/module", "vuetify-nuxt-module"],

  devConsole: {
    enabled: true,
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
