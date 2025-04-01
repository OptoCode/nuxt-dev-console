export default defineNuxtModule({
  meta: {
    name: "nuxt-dev-console",
    configKey: "devConsole",
    compatibility: {
      nuxt: "^3.0.0",
      node: ">=16.0.0",
    },
  },
  defaults: {
    enabled: true,
  },
  schema: {
    enabled: {
      type: "boolean",
      default: true,
    },
  },
  setup(options, nuxt) {
    try {
      if (!options.enabled) {
        return;
      }

      const resolver = createResolver(import.meta.url);

      // Add module hooks for extensibility
      nuxt.hook("devConsole:beforeInit", () => {
        // Hook for module initialization
      });

      nuxt.hook("devConsole:log", (log) => {
        // Hook for log interception
      });

      // Add DevConsole component
      try {
        addComponent({
          name: "DevConsole",
          filePath: resolver.resolve("./runtime/components/DevConsole.vue"),
          global: true,
        });
      } catch (error) {
        console.error("Failed to register DevConsole component:", error);
        throw error;
      }

      // Add composables
      addImportsDir(resolver.resolve("./runtime/composables"));

      // Add plugin to inject DevConsole into app
      nuxt.hook("app:templates", () => {
        try {
          addComponent({
            name: "NuxtDevConsole",
            filePath: resolver.resolve("./runtime/components/DevConsole.vue"),
            global: true,
          });
        } catch (error) {
          console.error("Failed to register NuxtDevConsole component:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Failed to setup nuxt-dev-console module:", error);
      throw error;
    }
  },
});
