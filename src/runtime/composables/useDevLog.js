import { ref } from "vue";

const useDevLog = () => {
  const isDev = import.meta.dev;
  const logBuffer = ref([]);
  const bufferTimeout = ref(null);
  const maxLogSize = 1000; // Maximum number of logs to keep

  const flushBuffer = () => {
    if (logBuffer.value.length) {
      logs.value.unshift(...logBuffer.value);
      // Trim logs if they exceed maxLogSize
      if (logs.value.length > maxLogSize) {
        logs.value = logs.value.slice(0, maxLogSize);
      }
      logBuffer.value = [];
    }
  };

  const createLog = (type, args) => {
    if (!isDev) return;

    try {
      const sanitizedArgs = args.map((arg) => {
        if (arg instanceof Error) {
          return {
            name: arg.name,
            message: arg.message,
            stack: arg.stack,
          };
        }
        return arg;
      });

      logBuffer.value.push({
        type,
        content: sanitizedArgs,
        timestamp: new Date(),
      });

      if (bufferTimeout.value) clearTimeout(bufferTimeout.value);
      bufferTimeout.value = setTimeout(flushBuffer, 100);
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  };

  const log = (...args) => createLog("log", args);
  const error = (...args) => createLog("error", args);
  const warn = (...args) => createLog("warn", args);
  const info = (...args) => createLog("info", args);

  return {
    log,
    error,
    warn,
    info,
  };
};

export default useDevLog;
