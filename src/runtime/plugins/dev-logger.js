/**
 * Development-only logger for Nuxt applications
 * This plugin provides a logger that only outputs in development mode
 */
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((_nuxtApp) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Queue system for handling logs
  const logQueue = [];
  const MAX_QUEUE_SIZE = 1000;
  const FLUSH_INTERVAL = 100; // ms

  const processQueue = () => {
    while (logQueue.length > 0) {
      try {
        const { method, args } = logQueue.shift();
        console[method](...args);
      } catch (error) {
        console.error('[DevLogger] Error processing log:', error);
      }
    }
  };

  // Start queue processor
  let queueInterval;
  if (isDev) {
    queueInterval = setInterval(processQueue, FLUSH_INTERVAL);
  }

  // Create logger functions that only work in development mode
  const createDevLogger = () => {
    // If not in development mode, return no-op functions
    if (!isDev && typeof window !== 'undefined' && !window?.__NUXT__?.config?.public?.devConsole?.allowProduction) {
      return {
        log: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
        group: () => {},
        groupEnd: () => {},
        time: () => {},
        timeEnd: () => {},
        trace: () => {},
        assert: () => {},
        table: () => {},
        dir: () => {},
        dirxml: () => {},
      };
    }

    const createLogMethod = (method) => (...args) => {
      try {
        if (logQueue.length >= MAX_QUEUE_SIZE) {
          logQueue.shift(); // Remove oldest log if queue is full
        }
        logQueue.push({ method, args: ['[DevLogger]', ...args] });
      } catch (error) {
        console.error('[DevLogger] Failed to queue log:', error);
      }
    };

    return {
      log: createLogMethod('log'),
      info: createLogMethod('info'),
      warn: createLogMethod('warn'),
      error: createLogMethod('error'),
      debug: createLogMethod('debug'),
      group: (label) => createLogMethod('group')(`[DevLogger] ${label}`),
      groupEnd: createLogMethod('groupEnd'),
      time: (label) => createLogMethod('time')(`[DevLogger] ${label}`),
      timeEnd: (label) => createLogMethod('timeEnd')(`[DevLogger] ${label}`),
      trace: createLogMethod('trace'),
      assert: (condition, ...args) => createLogMethod('assert')(condition, '[DevLogger]', ...args),
      table: (data, columns) => createLogMethod('table')(data, columns),
      dir: (obj, options) => createLogMethod('dir')(obj, options),
      dirxml: (obj) => createLogMethod('dirxml')(obj),
    };
  };

  // Create the logger
  const devLogger = createDevLogger();

  // Also expose a global for easier access in development
  if (isDev && typeof window !== 'undefined') {
    try {
      window.$devLogger = devLogger;
      console.log('[DevLogger] Initialized and available globally as window.$devLogger');
    } catch (error) {
      console.error('[DevLogger] Failed to expose global logger:', error);
    }
  }

  // Cleanup on plugin unmount
  if (isDev) {
    _nuxtApp.hook('app:unmount', () => {
      clearInterval(queueInterval);
      processQueue(); // Process remaining logs
    });
  }

  return {
    provide: {
      devLogger
    }
  };
});
