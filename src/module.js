import {
  defineNuxtModule,
  addComponent,
  createResolver,
  addImportsDir,
  installModule,
} from "@nuxt/kit";

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
    position: "bottom-right",
    theme: "dark",
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
  schema: {
    enabled: {
      type: "boolean",
    },
    position: {
      type: "string",
      enum: ["bottom-right", "bottom-left", "top-right", "top-left"],
    },
    theme: {
      type: "string",
      enum: ["light", "dark", "system"],
    },
    height: {
      type: "number",
      min: 100,
    },
    width: {
      type: "number",
      min: 200,
    },
    maxLogHistory: {
      type: "number",
      min: 10,
    },
    shortcuts: {
      type: "object",
      properties: {
        toggle: { type: "string" },
        clear: { type: "string" },
      },
    },
    allowProduction: {
      type: "boolean",
    },
    filters: {
      type: "object",
      properties: {
        showTimestamp: { type: "boolean" },
        showLogLevel: { type: "boolean" },
        minLevel: {
          type: "string",
          enum: ["info", "warn", "error"],
        },
      },
    },
  },
  async setup(options, nuxt) {
    // Validate Nuxt environment
    if (!nuxt) {
      throw new Error("nuxt-dev-console module requires a valid Nuxt instance");
    }

    try {
      if (!options.enabled) {
        return;
      }

      // Environment checks
      const isProduction = process.env.NODE_ENV === "production";
      if (isProduction && !options.allowProduction) {
        console.warn(
          "[nuxt-dev-console] DevConsole is disabled in production. Set allowProduction: true to override."
        );
        return;
      }

      const resolver = createResolver(import.meta.url);

      // Register module hooks
      nuxt.hook("devConsole:beforeInit", (_context) => {
        // Hook triggered before console initialization
        // Use this to modify initial setup or inject dependencies
      });

      nuxt.hook("devConsole:afterInit", (_context) => {
        // Hook triggered after console is initialized
        // Use this to add custom functionality or modify console behavior
      });

      nuxt.hook("devConsole:log", (_log) => {
        // Hook for intercepting and processing logs
        // log: { level, message, timestamp, metadata }
      });

      // Install required dependencies
      try {
        await installModule("vuetify-nuxt-module", {
          moduleOptions: {
            prefixForDefaultIcons: "mdi",
          },
        });
      } catch (error) {
        console.error("[nuxt-dev-console] Failed to install Vuetify:", error);
        throw new Error("Failed to install required dependencies");
      }

      // Register components
      try {
        await addComponent({
          name: "DevConsole",
          filePath: resolver.resolve("./runtime/components/DevConsole.vue"),
          global: true,
        });
      } catch (error) {
        console.error(
          "[nuxt-dev-console] Failed to register DevConsole component:",
          error
        );
        throw error;
      }

      // Add composables with error handling
      try {
        await addImportsDir(resolver.resolve("./runtime/composables"));
      } catch (error) {
        console.error(
          "[nuxt-dev-console] Failed to register composables:",
          error
        );
        throw error;
      }

      // Add runtime config with validation
      const runtimeConfig = {
        ...options,
        version: nuxt.options.version,
        environment: process.env.NODE_ENV,
      };

      nuxt.options.runtimeConfig.public.devConsole = runtimeConfig;

      // Trigger afterInit hook
      await nuxt.callHook("devConsole:afterInit", { options: runtimeConfig });
    } catch (error) {
      console.error("[nuxt-dev-console] Module initialization failed:", error);
      throw error;
    }
  },
});
