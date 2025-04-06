declare module "@opto-code/nuxt-dev-console" {
  /**
   * Common log tag categories
   */
  type LogTag = 
    | 'auth' 
    | 'api' 
    | 'database' 
    | 'ui' 
    | 'error' 
    | 'warning' 
    | 'debug' 
    | 'performance' 
    | 'frontend'
    | 'backend'
    | 'middleware'
    | 'success'
    | 'failure'
    | 'pending'
    | 'config'
    | 'system'
    | string;

  /**
   * Log level types
   */
  type LogLevel = 'log' | 'error' | 'warn' | 'info';

  /**
   * Structure of a log entry
   */
  interface LogEntry {
    type: LogLevel;
    content: any[];
    timestamp: number;
    tags?: LogTag[];
    groupId?: string;
    isGroup?: boolean;
    collapsed?: boolean;
  }

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
     * @default 600
     */
    height?: number;

    /**
     * Initial width of the console window in pixels
     * @default 800
     */
    width?: number;

    /**
     * Maximum number of logs to keep in history
     * @default 1000
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
      /**
       * Shortcut to focus search
       * @default 'ctrl+f'
       */
      search?: string;
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
      minLevel?: LogLevel;
    };

    /**
     * Custom theme configuration
     */
    customTheme?: {
      dark?: {
        background?: string;
        text?: string;
        [key: string]: string | undefined;
      };
      light?: {
        background?: string;
        text?: string;
        [key: string]: string | undefined;
      };
    };
  }

  interface DevConsoleInstance {
    /**
     * Log a message to the dev console
     */
    log: (message: any, ...args: any[]) => void;

    /**
     * Log an error to the dev console
     */
    error: (message: any, ...args: any[]) => void;

    /**
     * Log a warning to the dev console
     */
    warn: (message: any, ...args: any[]) => void;

    /**
     * Log an info message to the dev console
     */
    info: (message: any, ...args: any[]) => void;

    /**
     * Log a message with tags to the dev console
     * @param tags Array of tags to categorize the log
     * @param message Main message to log
     * @param args Additional arguments to log
     */
    logWithTags: (tags: LogTag[], message: any, ...args: any[]) => void;

    /**
     * Log an error with tags to the dev console
     * @param tags Array of tags to categorize the error
     * @param message Error message or Error object
     * @param args Additional arguments to log
     */
    errorWithTags: (tags: LogTag[], message: any, ...args: any[]) => void;

    /**
     * Log a warning with tags to the dev console
     * @param tags Array of tags to categorize the warning
     * @param message Warning message
     * @param args Additional arguments to log
     */
    warnWithTags: (tags: LogTag[], message: any, ...args: any[]) => void;

    /**
     * Log an info message with tags to the dev console
     * @param tags Array of tags to categorize the info
     * @param message Info message
     * @param args Additional arguments to log
     */
    infoWithTags: (tags: LogTag[], message: any, ...args: any[]) => void;

    /**
     * Clear the dev console
     */
    clear: () => void;

    /**
     * Start a new log group
     */
    group: (label: string) => void;

    /**
     * Start a new collapsed log group
     */
    groupCollapsed: (label: string) => void;

    /**
     * End the current log group
     */
    groupEnd: () => void;

    /**
     * Export logs in various formats
     */
    exportLogs: (format?: 'json' | 'csv' | 'txt') => void;
  }

  interface DevConsoleHooks {
    "devConsole:beforeInit": () => void | Promise<void>;
    "devConsole:log": (log: LogEntry) => void | Promise<void>;
    "devConsole:clear": () => void | Promise<void>;
    "devConsole:export": (format: string) => void | Promise<void>;
  }
}

// Extend Nuxt's runtime config
declare module "@nuxt/schema" {
  interface RuntimeConfig {
    devConsole?: ModuleOptions;
  }
  interface PublicRuntimeConfig {
    devConsole?: ModuleOptions;
  }
}
