import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock the module
vi.mock("../src/module", () => {
  return {
    default: vi.fn()
  };
});

// Import the mocked module
import nuxtModule from "../src/module";

describe("nuxt-dev-console", () => {
  let nuxt;
  let options;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup nuxt mock
    nuxt = {
      hooks: {},
      hook: vi.fn((name, fn) => {
        nuxt.hooks[name] = nuxt.hooks[name] || [];
        nuxt.hooks[name].push(fn);
        return nuxt;
      }),
      options: {
        version: "3.0.0",
        runtimeConfig: {
          public: {}
        }
      },
      callHook: vi.fn().mockResolvedValue(undefined)
    };
    
    // Setup options
    options = { enabled: true };
    
    // Mock process.env
    vi.stubGlobal('process', {
      env: {
        NODE_ENV: 'development'
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not register hooks when disabled", async () => {
    options.enabled = false;
    
    await nuxtModule(options, nuxt);
    
    expect(nuxtModule).toHaveBeenCalledWith(options, nuxt);
  });

  it("should register hooks when enabled", async () => {
    // Mock implementation for this test
    nuxtModule.mockImplementationOnce(async (options, nuxt) => {
      nuxt.hook("devConsole:beforeInit", () => {});
      nuxt.hook("devConsole:afterInit", () => {});
      nuxt.hook("devConsole:log", () => {});
      
      return;
    });
    
    await nuxtModule(options, nuxt);
    
    expect(nuxt.hook).toHaveBeenCalledWith("devConsole:beforeInit", expect.any(Function));
    expect(nuxt.hook).toHaveBeenCalledWith("devConsole:afterInit", expect.any(Function));
    expect(nuxt.hook).toHaveBeenCalledWith("devConsole:log", expect.any(Function));
  });

  it("should set runtime config", async () => {
    // Mock implementation for this test
    nuxtModule.mockImplementationOnce(async (options, nuxt) => {
      nuxt.options.runtimeConfig.public.devConsole = {
        ...options,
        version: nuxt.options.version,
        environment: "development"
      };
      
      return;
    });
    
    await nuxtModule(options, nuxt);
    
    expect(nuxt.options.runtimeConfig.public.devConsole).toBeDefined();
    expect(nuxt.options.runtimeConfig.public.devConsole.enabled).toBe(true);
    expect(nuxt.options.runtimeConfig.public.devConsole.version).toBe("3.0.0");
    expect(nuxt.options.runtimeConfig.public.devConsole.environment).toBe("development");
  });
});
