import { ref } from "vue";

// Create shared state outside the composable
const logs = ref([]);
const maxLogSize = 1000; // Maximum number of logs to keep
let isLogging = false; // Flag to prevent recursive logging
let browserConsoleEnabled = true; // Direct control for browser console logging

const createLog = (type, args) => {
  try {
    // Prevent recursive logging
    if (isLogging) return;
    isLogging = true;

    // Log to browser console if enabled
    if (browserConsoleEnabled) {
      // Use original console methods to avoid recursion
      const originalConsole = window.console;
      originalConsole[type](...args);
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
        } catch (e) {
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

const useDevLog = () => {
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
  };
};

export default useDevLog;
