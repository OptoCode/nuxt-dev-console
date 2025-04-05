import { ref } from "vue";

// Create shared state outside the composable
const logs = ref([]);
const maxLogSize = 1000; // Maximum number of logs to keep
let isLogging = false; // Flag to prevent recursive logging
let browserConsoleEnabled = true; // Direct control for browser console logging
let isConsoleIntercepted = false; // Flag to track if console is intercepted
let originalConsole = null; // Store original console methods

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a no-op version for production when the module is disabled
const createNoOpDevLog = () => {
  // Empty ref for logs
  const emptyLogs = ref([]);
  
  // No-op functions that do nothing
  const noop = () => {};
  
  return {
    log: noop,
    error: noop,
    warn: noop,
    info: noop,
    clear: noop,
    logs: emptyLogs,
    enableBrowserConsole: noop,
    disableBrowserConsole: noop,
    interceptConsole: noop,
    restoreConsole: noop,
  };
};

const createLog = (type, args) => {
  try {
    // Prevent recursive logging
    if (isLogging) return;
    isLogging = true;

    // Log to browser console if enabled
    if (browserConsoleEnabled) {
      // Use original console methods to avoid recursion
      if (originalConsole) {
        originalConsole[type](...args);
      }
    }

    const sanitizedArgs = args.map((arg) => {
      if (arg instanceof Error) {
        return {
          name: arg.name,
          message: arg.message,
          stack: arg.stack,
        };
      }
      if (arg === null) return "null";
      if (arg === undefined) return "undefined";
      if (typeof arg === "object") {
        try {
          return JSON.parse(JSON.stringify(arg));
        // eslint-disable-next-line no-unused-vars
        } catch (_) {
          return String(arg);
        }
      }
      return arg;
    });

    logs.value.push({
      type,
      content: sanitizedArgs,
      timestamp: Date.now(),
    });

    // Trim logs if they exceed maxLogSize
    if (logs.value.length > maxLogSize) {
      logs.value = logs.value.slice(-maxLogSize);
    }
  } catch (error) {
    // Use the original console to avoid circular reference
    if (!isLogging) {
      console.error("Failed to create log:", error);
    }
  } finally {
    isLogging = false;
  }
};

const interceptConsole = () => {
  if (isConsoleIntercepted) return;

  // Store original methods with proper binding
  originalConsole = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console),
  };

  // Override console methods
  console.log = (...args) => {
    createLog("log", args);
    originalConsole.log(...args);
  };

  console.error = (...args) => {
    createLog("error", args);
    originalConsole.error(...args);
  };

  console.warn = (...args) => {
    createLog("warn", args);
    originalConsole.warn(...args);
  };

  console.info = (...args) => {
    createLog("info", args);
    originalConsole.info(...args);
  };

  isConsoleIntercepted = true;
};

const restoreConsole = () => {
  if (!isConsoleIntercepted || !originalConsole) return;

  Object.assign(console, originalConsole);
  originalConsole = null;
  isConsoleIntercepted = false;
};

const useDevLog = () => {
  // If we're in production and in a browser, return a no-op version
  // This prevents errors when the module is disabled in production
  if (isProduction && isBrowser) {
    try {
      // Check if the devConsole module is enabled in production
      const runtimeConfig = window?.__NUXT__?.config?.public?.devConsole;
      if (!runtimeConfig || !runtimeConfig.allowProduction) {
        // Return no-op version when module is disabled in production
        return createNoOpDevLog();
      }
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      // If there's any error accessing the config, return no-op version to be safe
      return createNoOpDevLog();
    }
  }

  // Regular implementation for development or when module is enabled in production
  const log = (...args) => createLog("log", args);
  const error = (...args) => createLog("error", args);
  const warn = (...args) => createLog("warn", args);
  const info = (...args) => createLog("info", args);
  const clear = () => {
    logs.value = [];
  };

  // Add methods to control browser console logging
  const enableBrowserConsole = () => {
    browserConsoleEnabled = true;
  };

  const disableBrowserConsole = () => {
    browserConsoleEnabled = false;
  };

  return {
    log,
    error,
    warn,
    info,
    clear,
    logs,
    enableBrowserConsole,
    disableBrowserConsole,
    interceptConsole,
    restoreConsole,
  };
};

export { useDevLog };
