/**
 * Development-only logger for Nuxt applications
 * This plugin provides a logger that only outputs in development mode
 */
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((_nuxtApp) => {
  const isDev = process.env.NODE_ENV === 'development';
  
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

    // In development mode, return functions that log with a prefix
    return {
      log: (...args) => console.log('[DevLogger]', ...args),
      info: (...args) => console.info('[DevLogger]', ...args),
      warn: (...args) => console.warn('[DevLogger]', ...args),
      error: (...args) => console.error('[DevLogger]', ...args),
      debug: (...args) => console.debug('[DevLogger]', ...args),
      group: (label) => console.group(`[DevLogger] ${label}`),
      groupEnd: () => console.groupEnd(),
      time: (label) => console.time(`[DevLogger] ${label}`),
      timeEnd: (label) => console.timeEnd(`[DevLogger] ${label}`),
      trace: (...args) => console.trace('[DevLogger]', ...args),
      assert: (condition, ...args) => console.assert(condition, '[DevLogger]', ...args),
      table: (data, columns) => console.table(data, columns),
      dir: (obj, options) => console.dir(obj, options),
      dirxml: (obj) => console.dirxml(obj),
    };
  };

  // Create the logger
  const devLogger = createDevLogger();

  // Also expose a global for easier access in development
  if (isDev && typeof window !== 'undefined') {
    window.$devLogger = devLogger;
    console.log('[DevLogger] Initialized and available globally as window.$devLogger');
  }

  return {
    provide: {
      devLogger
    }
  };
});
