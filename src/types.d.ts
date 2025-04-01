declare module "@opto-code/nuxt-dev-console" {
  interface ModuleOptions {
    /**
     * Enable or disable the dev console
     * @default true
     */
    enabled?: boolean;

    /**
     * Position of the dev console on the screen
     * @default 'bottom-right'
     */
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";

    /**
     * Theme of the dev console
     * @default 'dark'
     */
    theme?: "light" | "dark" | "system";

    /**
     * Initial height of the console window in pixels
     * @default 300
     */
    height?: number;

    /**
     * Initial width of the console window in pixels
     * @default 400
     */
    width?: number;

    /**
     * Maximum number of logs to keep in history
     * @default 100
     */
    maxLogHistory?: number;

    /**
     * Keyboard shortcuts configuration
     */
    shortcuts?: {
      /**
       * Shortcut to toggle console visibility
       * @default 'ctrl+shift+d'
       */
      toggle?: string;
      /**
       * Shortcut to clear console
       * @default 'ctrl+l'
       */
      clear?: string;
    };

    /**
     * Allow console in production mode
     * @default false
     */
    allowProduction?: boolean;

    /**
     * Filter configuration for console output
     */
    filters?: {
      /**
       * Show timestamps with logs
       * @default true
       */
      showTimestamp?: boolean;
      /**
       * Show log levels (info, warn, error)
       * @default true
       */
      showLogLevel?: boolean;
      /**
       * Minimum log level to display
       * @default 'info'
       */
      minLevel?: "info" | "warn" | "error";
    };
  }

  interface DevConsoleInstance {
    /**
     * Log a message to the dev console
     */
    log: (message: any) => void;
    /**
     * Log an error to the dev console
     */
    error: (error: any) => void;
    /**
     * Log a warning to the dev console
     */
    warn: (message: any) => void;
    /**
     * Clear the dev console
     */
    clear: () => void;
  }

  interface DevConsoleHooks {
    "devConsole:beforeInit": () => void | Promise<void>;
    "devConsole:log": (log: {
      type: string;
      message: any;
      timestamp: number;
    }) => void | Promise<void>;
  }
}

// Extend Nuxt's runtime config
declare module "@nuxt/schema" {
  interface RuntimeConfig {
    devConsole?: {
      enabled: boolean;
    };
  }
  interface PublicRuntimeConfig {
    devConsole?: {
      enabled: boolean;
    };
  }
}
