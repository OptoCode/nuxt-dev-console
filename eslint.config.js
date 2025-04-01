import globals from "globals";
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import * as parser from "vue-eslint-parser";

const nuxtGlobals = {
  defineNuxtConfig: "readonly",
  useRuntimeConfig: "readonly",
  useNuxtApp: "readonly",
  process: "readonly",
  Buffer: "readonly",
};

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...nuxtGlobals,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-undef": "error",
      "no-useless-escape": "warn",
    },
  },
  {
    files: ["**/*.vue"],
    plugins: {
      vue: pluginVue,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...nuxtGlobals,
      },
      parser: parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...pluginVue.configs.essential.rules,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
