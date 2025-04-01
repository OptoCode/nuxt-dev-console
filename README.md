# nuxt-dev-console

A development console for Nuxt 3 applications with filtering and copy capabilities.

## Installation

```bash
npm install nuxt-dev-console
# or
yarn add nuxt-dev-console
```

## Setup

Add `nuxt-dev-console` to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-dev-console'],
  devConsole: {
    enabled: true // enabled by default
  }
})
```

## Usage

The DevConsole will be automatically available in development mode.

Use the composable:
```ts
const devLog = useDevLog()

devLog.log('Hello')
devLog.error('Error message')
devLog.warn('Warning message')
devLog.info('Info message')
```
```

6. Create a playground for testing:
```bash
mkdir playground
cd playground
npx nuxi init .
```

To publish:
1. Build your module:
```bash
npm run build
```

2. Publish to npm:
```bash
npm publish
```

Best Practices:
1. Use TypeScript for better type support
2. Include comprehensive documentation
3. Add tests using Vitest
4. Use semantic versioning
5. Add CI/CD with GitHub Actions
6. Include examples in the playground
7. Add proper ESLint and Prettier configs
8. Use changesets for version management

This structure follows the official Nuxt module template and makes it easy for others to:
1. Install via npm/yarn
2. Configure through nuxt.config
3. Get TypeScript support
4. Access documentation
5. See examples in the playground
6. Contribute through GitHub
