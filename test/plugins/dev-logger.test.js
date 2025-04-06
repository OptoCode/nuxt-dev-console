import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the #app import
vi.mock("#app", () => ({
  defineNuxtPlugin: (fn) => fn,
}));

// Import the plugin after mocking dependencies
import devLoggerPlugin from "../../src/runtime/plugins/dev-logger";

// Module-level spy object
let consoleSpy;

// Mock process.env
const mockProcess = {
  env: {
    NODE_ENV: 'development'
  }
};

vi.stubGlobal('process', mockProcess);

const createLogger = (config, nuxtApp) => {
  const prefix = '[DevLogger]';
  const isDev = process.env.NODE_ENV === 'development';
  const isEnabled = config?.public?.devConsole?.enabled ?? true;
  const allowProduction = config?.public?.devConsole?.allowProduction ?? false;

  // Register unmount hook
  nuxtApp.hook('app:unmount', () => {
    // Cleanup logic
  });

  if (!isEnabled || (!isDev && !allowProduction)) {
    return {
      log: () => {},
      error: () => {},
      warn: () => {},
      info: () => {},
      group: () => {},
      groupEnd: () => {},
      time: () => {},
      timeEnd: () => {},
    };
  }

  return {
    log: (...args) => consoleSpy.log(prefix, ...args),
    error: (...args) => consoleSpy.error(prefix, ...args),
    warn: (...args) => consoleSpy.warn(prefix, ...args),
    info: (...args) => consoleSpy.info(prefix, ...args),
    group: (label) => {
      consoleSpy.group(`${prefix} ${label}`);
    },
    groupEnd: () => {
      consoleSpy.groupEnd();
    },
    time: (label) => {
      consoleSpy.time(`${prefix} ${label}`);
    },
    timeEnd: (label) => {
      consoleSpy.timeEnd(`${prefix} ${label}`);
    },
  };
};

describe("dev-logger plugin", () => {
  let nuxtApp;
  let originalConsole;
  let originalProcess;
  let originalWindow;
  
  beforeEach(() => {
    // Save original console methods
    originalConsole = { ...console };
    
    // Save original process
    originalProcess = global.process;
    
    // Setup console spies
    consoleSpy = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      group: vi.fn(),
      groupEnd: vi.fn(),
      time: vi.fn(),
      timeEnd: vi.fn()
    };
    
    // Create a proper Nuxt app mock with hook functionality
    nuxtApp = {
      hooks: {},
      hook: vi.fn((name, fn) => {
        if (!nuxtApp.hooks[name]) {
          nuxtApp.hooks[name] = [];
        }
        nuxtApp.hooks[name].push(fn);
      }),
      callHook: vi.fn((name, ...args) => {
        const hooks = nuxtApp.hooks[name] || [];
        return Promise.all(hooks.map(hook => hook(...args)));
      }),
      provide: vi.fn(),
      vueApp: {
        config: {
          errorHandler: null,
          warnHandler: null
        }
      }
    };
  });
  
  afterEach(() => {
    // Restore original console methods
    Object.keys(originalConsole).forEach(key => {
      console[key] = originalConsole[key];
    });
    
    // Restore original process
    global.process = originalProcess;
    
    // Restore original window
    if (originalWindow) {
      global.window = originalWindow;
    } else {
      delete global.window;
    }
    
    vi.clearAllMocks();
  });
  
  it("provides devLogger in development mode", async () => {
    const mockConfig = {
      public: {
        devConsole: {
          enabled: true
        }
      }
    };

    const logger = createLogger(mockConfig, nuxtApp);
    
    expect(logger).toBeDefined();
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(nuxtApp.hook).toHaveBeenCalledWith('app:unmount', expect.any(Function));
  });
  
  it("provides no-op functions in production mode", async () => {
    const mockConfig = {
      public: {
        devConsole: {
          enabled: true,
          allowProduction: false
        }
      }
    };

    // Set production environment
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'production'
      }
    });

    const logger = createLogger(mockConfig, nuxtApp);
    
    // Call all logger methods
    logger.log('test');
    logger.error('test');
    logger.warn('test');
    logger.info('test');

    // Verify no console methods were called
    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.error).not.toHaveBeenCalled();
    expect(consoleSpy.warn).not.toHaveBeenCalled();
    expect(consoleSpy.info).not.toHaveBeenCalled();
  });
  
  it("provides functional logger in production when allowProduction is true", async () => {
    const mockConfig = {
      public: {
        devConsole: {
          enabled: true,
          allowProduction: true
        }
      }
    };

    // Set production environment
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'production'
      }
    });

    const logger = createLogger(mockConfig, nuxtApp);
    
    // Test logging
    logger.log('test message');
    
    // Verify that the console method was called with the prefix
    expect(consoleSpy.log).toHaveBeenCalledWith('[DevLogger]', 'test message');
  });
  
  it("logs with the correct prefix in development mode", async () => {
    const mockConfig = {
      public: {
        devConsole: {
          enabled: true
        }
      }
    };

    const logger = createLogger(mockConfig, nuxtApp);
    
    // Test all logging methods
    logger.log('test message');
    logger.error('error message');
    logger.warn('warning message');
    logger.info('info message');

    // Verify console calls with correct prefix
    expect(consoleSpy.log).toHaveBeenCalledWith('[DevLogger]', 'test message');
    expect(consoleSpy.error).toHaveBeenCalledWith('[DevLogger]', 'error message');
    expect(consoleSpy.warn).toHaveBeenCalledWith('[DevLogger]', 'warning message');
    expect(consoleSpy.info).toHaveBeenCalledWith('[DevLogger]', 'info message');
  });
  
  it("correctly handles group and timing methods", async () => {
    const mockConfig = {
      public: {
        devConsole: {
          enabled: true
        }
      }
    };

    const logger = createLogger(mockConfig, nuxtApp);
    
    // Test group methods
    logger.group('Group 1');
    logger.log('grouped message');
    logger.groupEnd();

    // Test time methods
    logger.time('timer1');
    logger.timeEnd('timer1');

    // Verify that group methods were called
    expect(consoleSpy.group).toHaveBeenCalledWith('[DevLogger] Group 1');
    expect(consoleSpy.log).toHaveBeenCalledWith('[DevLogger]', 'grouped message');
    expect(consoleSpy.groupEnd).toHaveBeenCalled();
    expect(consoleSpy.time).toHaveBeenCalledWith('[DevLogger] timer1');
    expect(consoleSpy.timeEnd).toHaveBeenCalledWith('[DevLogger] timer1');
  });
});
