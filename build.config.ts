import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/module",
    { input: "src/types.d.ts", outDir: "dist", format: "esm" },
  ],
  declaration: true,
  externals: ["@nuxt/kit", "@nuxt/schema", "vuetify-nuxt-module"],
});
