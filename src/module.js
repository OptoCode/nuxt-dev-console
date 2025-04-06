import {
  defineNuxtModule,
  addComponent,
  createResolver,
  installModule,
  addPlugin,
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
      minLevel: "info", // Default minimum log level to show
    },
  },
  async setup(options, nuxt) {
    // Validate Nuxt environment
    if (!nuxt) {
      throw new Error("nuxt-dev-console module requires a valid Nuxt instance");
    }

    try {
      // Create resolver early so we can use it
      const resolver = createResolver(import.meta.url);
      
      // Always register the dev-logger plugin regardless of enabled state
      // It will handle production mode internally
      addPlugin({
        src: resolver.resolve('./runtime/plugins/dev-logger'),
        mode: 'client',
      });
      
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

      // Add runtime config with validation
      const runtimeConfig = {
        ...options,
        version: nuxt.options.version,
        environment: process.env.NODE_ENV,
      };

      // Debug log the configuration
      console.log("[nuxt-dev-console] Setting runtime config:", runtimeConfig);

      nuxt.options.runtimeConfig.public.devConsole = runtimeConfig;

      // Add unmounting flag to window
      if (process.client) {
        nuxt.hook("app:unmount", () => {
          window.__NUXT_DEV_CONSOLE_UNMOUNTING__ = true;
        });
      }

      // Trigger afterInit hook
      await nuxt.callHook("devConsole:afterInit", { options: runtimeConfig });
    } catch (error) {
      console.error("[nuxt-dev-console] Module initialization failed:", error);
      throw error;
    }
  },
});
