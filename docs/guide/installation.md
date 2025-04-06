# Installation

## Package Installation

Choose your preferred package manager:

::: code-group
```bash [npm]
npm install @opto-code/nuxt-dev-console
```

```bash [yarn]
yarn add @opto-code/nuxt-dev-console
```

```bash [pnpm]
pnpm add @opto-code/nuxt-dev-console
```
:::

## Module Setup

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    enabled: true
  }
})
```

## Development vs Production

By default, the console is only enabled in development mode. To enable it in production:

```ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    enabled: true,
    allowProduction: true // Enable in production
  }
})
```

::: warning
Enabling the console in production should be done with caution as it may expose sensitive debugging information.
:::

## TypeScript Support

The module includes full TypeScript support out of the box. No additional setup is required.

## Verification

To verify the installation:

1. Start your development server:
```bash
npm run dev
```

2. Open your browser's console
3. You should see the initialization message:
```
[DevLogger] Initialized and available globally as window.$devLogger
```

## Troubleshooting

If you encounter any issues:

1. Ensure you're using Nuxt 3
2. Check your Node.js version (16.x or later required)
3. Clear your node_modules and reinstall dependencies
4. Verify the module is listed in your `nuxt.config.ts`

## Next Steps

- Continue to the [Quick Start Guide](/guide/quick-start)
- Learn about [Configuration Options](/features/configuration)
- Explore [Advanced Features](/features/dev-console) 