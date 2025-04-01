// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@opto-code/nuxt-dev-console"],
  devConsole: {
    // Basic configuration for testing
    enabled: true,
    position: "top-left",
    theme: "light",
    height: 300,
    width: 400,
  },
});
