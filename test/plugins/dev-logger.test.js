import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the #app import
vi.mock("#app", () => ({
  defineNuxtPlugin: (fn) => fn,
}));

// Import the plugin after mocking dependencies
import devLoggerPlugin from "../../src/runtime/plugins/dev-logger";

describe("dev-logger plugin", () => {
  let nuxtApp;
  let originalConsole;
  let originalProcess;
  let originalWindow;
  
  beforeEach(() => {
    // Save original console methods
    originalConsole = { ...console };
    
    // Mock console methods
    console.log = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.debug = vi.fn();
    console.group = vi.fn();
    console.groupEnd = vi.fn();
    console.time = vi.fn();
    console.timeEnd = vi.fn();
    console.trace = vi.fn();
    console.assert = vi.fn();
    console.table = vi.fn();
    console.dir = vi.fn();
    console.dirxml = vi.fn();
    
    // Save original process and window
    originalProcess = { ...process };
    originalWindow = global.window;
    
    // Mock nuxtApp
    nuxtApp = {
      provide: vi.fn()
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
  });
  
  it("provides devLogger in development mode", () => {
    // Set up development environment
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'development'
      }
    });
    
    // Mock window
    vi.stubGlobal('window', {});
    
    // Call the plugin
    const result = devLoggerPlugin(nuxtApp);
    
    // Check that the plugin provides the devLogger
    expect(result).toHaveProperty('provide');
    expect(result.provide).toHaveProperty('devLogger');
    
    // Check that the logger is exposed globally in development
    expect(window).toHaveProperty('$devLogger');
    expect(console.log).toHaveBeenCalledWith('[DevLogger] Initialized and available globally as window.$devLogger');
  });
  
  it("provides no-op functions in production mode", () => {
    // Set up production environment
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'production'
      }
    });
    
    // Mock window without production override
    vi.stubGlobal('window', {
      __NUXT__: {
        config: {
          public: {
            devConsole: {
              allowProduction: false
            }
          }
        }
      }
    });
    
    // Call the plugin
    const result = devLoggerPlugin(nuxtApp);
    
    // Check that the plugin provides the devLogger
    expect(result).toHaveProperty('provide');
    expect(result.provide).toHaveProperty('devLogger');
    
    // Call a method on the logger
    result.provide.devLogger.log('test message');
    
    // Verify that the console method was not called
    expect(console.log).not.toHaveBeenCalled();
  });
  
  it("provides functional logger in production when allowProduction is true", () => {
    // Set up production environment with allowProduction
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'production'
      }
    });
    
    // Mock window with production override
    vi.stubGlobal('window', {
      __NUXT__: {
        config: {
          public: {
            devConsole: {
              allowProduction: true
            }
          }
        }
      }
    });
    
    // Call the plugin
    const result = devLoggerPlugin(nuxtApp);
    
    // Check that the plugin provides the devLogger
    expect(result).toHaveProperty('provide');
    expect(result.provide).toHaveProperty('devLogger');
    
    // Call a method on the logger
    result.provide.devLogger.log('test message');
    
    // Verify that the console method was called with the prefix
    expect(console.log).toHaveBeenCalledWith('[DevLogger]', 'test message');
  });
  
  it("logs with the correct prefix in development mode", () => {
    // Set up development environment
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'development'
      }
    });
    
    // Mock window
    vi.stubGlobal('window', {});
    
    // Call the plugin
    const result = devLoggerPlugin(nuxtApp);
    
    // Test different logging methods
    result.provide.devLogger.log('log message');
    result.provide.devLogger.info('info message');
    result.provide.devLogger.warn('warn message');
    result.provide.devLogger.error('error message');
    result.provide.devLogger.debug('debug message');
    
    // Verify that each console method was called with the prefix
    expect(console.log).toHaveBeenCalledWith('[DevLogger]', 'log message');
    expect(console.info).toHaveBeenCalledWith('[DevLogger]', 'info message');
    expect(console.warn).toHaveBeenCalledWith('[DevLogger]', 'warn message');
    expect(console.error).toHaveBeenCalledWith('[DevLogger]', 'error message');
    expect(console.debug).toHaveBeenCalledWith('[DevLogger]', 'debug message');
  });
  
  it("correctly handles group and timing methods", () => {
    // Set up development environment
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'development'
      }
    });
    
    // Mock window
    vi.stubGlobal('window', {});
    
    // Call the plugin
    const result = devLoggerPlugin(nuxtApp);
    
    // Test group and timing methods
    result.provide.devLogger.group('test group');
    result.provide.devLogger.groupEnd();
    result.provide.devLogger.time('test timer');
    result.provide.devLogger.timeEnd('test timer');
    
    // Verify that each console method was called correctly
    expect(console.group).toHaveBeenCalledWith('[DevLogger] test group');
    expect(console.groupEnd).toHaveBeenCalled();
    expect(console.time).toHaveBeenCalledWith('[DevLogger] test timer');
    expect(console.timeEnd).toHaveBeenCalledWith('[DevLogger] test timer');
  });
});
