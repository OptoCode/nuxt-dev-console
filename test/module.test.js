import { describe, it, expect, beforeEach, vi } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, createResolver } from "@nuxt/kit";
import nuxtModule from "../src/module";

// Mock the Nuxt Kit functions
vi.mock("@nuxt/kit", async () => {
  const actual = await vi.importActual("@nuxt/kit");
  return {
    ...actual,
    installModule: vi.fn().mockResolvedValue(undefined),
    addComponent: vi.fn().mockResolvedValue(undefined),
    addImportsDir: vi.fn().mockResolvedValue(undefined),
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
      callHook: async () => {},
      constructor: {
        version: "3.0.0",
      },
    };
    options = { enabled: true };
  });

  it("registers components when enabled", async () => {
    const module = await nuxtModule(options, nuxt);
    expect(nuxt.hooks["devConsole:beforeInit"]).toBeDefined();
  });

  it("does not register components when disabled", async () => {
    options.enabled = false;
    const module = await nuxtModule(options, nuxt);
    expect(nuxt.hooks["devConsole:beforeInit"]).toBeUndefined();
  });

  it("registers devConsole hooks", async () => {
    const module = await nuxtModule(options, nuxt);
    expect(nuxt.hooks["devConsole:beforeInit"]).toBeDefined();
    expect(nuxt.hooks["devConsole:log"]).toBeDefined();
  });
});
