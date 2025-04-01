import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, createResolver } from "@nuxt/kit";
import module from "../src/module";

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
    };
    options = { enabled: true };
  });

  it("registers components when enabled", async () => {
    await module.setup(options, nuxt);
    expect(nuxt.hooks["app:templates"]).toBeDefined();
  });

  it("does not register components when disabled", async () => {
    options.enabled = false;
    await module.setup(options, nuxt);
    expect(nuxt.hooks["app:templates"]).toBeUndefined();
  });

  it("registers devConsole hooks", async () => {
    await module.setup(options, nuxt);
    expect(nuxt.hooks["devConsole:beforeInit"]).toBeDefined();
    expect(nuxt.hooks["devConsole:log"]).toBeDefined();
  });
});
