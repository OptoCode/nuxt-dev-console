import { describe, it, expect, beforeEach, vi } from "vitest";
import nuxtModule from "../src/module";

// Mock process.client
vi.stubGlobal('process', {
  ...process,
  client: undefined,
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

// Mock the Nuxt Kit functions
vi.mock("@nuxt/kit", async () => {
  const actual = await vi.importActual("@nuxt/kit");
  return {
    ...actual,
    installModule: vi.fn().mockResolvedValue(undefined),
    addComponent: vi.fn().mockResolvedValue(undefined),
    addImportsDir: vi.fn().mockResolvedValue(undefined),
    addImports: vi.fn().mockResolvedValue(undefined),
    createResolver: vi.fn().mockImplementation(() => ({
      resolve: (path) => path
    }))
  };
});

describe("nuxt-dev-console", () => {
  let nuxt;
  let options;

  beforeEach(() => {
    nuxt = {
      hooks: {},
      hook: (name, fn) => {
        nuxt.hooks[name] = nuxt.hooks[name] || [];
        nuxt.hooks[name].push(fn);
      },
      options: {
        version: "3.0.0",
        runtimeConfig: {
          public: {},
        },
      },
      _version: "3.0.0",
      version: "3.0.0",
      callHook: vi.fn().mockResolvedValue(undefined),
      constructor: {
        version: "3.0.0",
      },
    };
    options = { enabled: true };
  });

  it("registers components when enabled", async () => {
    await nuxtModule(options, nuxt);
    expect(nuxt.hooks["devConsole:beforeInit"]).toBeDefined();
  });

  it("does not register components when disabled", async () => {
    options.enabled = false;
    await nuxtModule(options, nuxt);
    expect(nuxt.hooks["devConsole:beforeInit"]).toBeUndefined();
  });

  it("registers devConsole hooks", async () => {
    await nuxtModule(options, nuxt);
    expect(nuxt.hooks["devConsole:beforeInit"]).toBeDefined();
    expect(nuxt.hooks["devConsole:log"]).toBeDefined();
  });

  it("adds runtime config with correct values", async () => {
    await nuxtModule(options, nuxt);
    expect(nuxt.options.runtimeConfig.public.devConsole).toBeDefined();
    expect(nuxt.options.runtimeConfig.public.devConsole.version).toBe("3.0.0");
    expect(nuxt.options.runtimeConfig.public.devConsole.environment).toBe("development");
  });

  it("calls afterInit hook with runtime config", async () => {
    await nuxtModule(options, nuxt);
    expect(nuxt.callHook).toHaveBeenCalledWith("devConsole:afterInit", expect.objectContaining({
      options: expect.objectContaining({
        version: "3.0.0",
        environment: "development"
      })
    }));
  });
});
