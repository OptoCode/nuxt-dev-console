# nuxt-dev-console

A development console for Nuxt 3 applications with filtering and copy capabilities.

## Features

- 🎨 Customizable theme (dark/light/system)
- 📍 Flexible positioning
- ⌨️ Keyboard shortcuts
- 🔍 Advanced filtering
- 📋 Copy to clipboard
- ⚡ Performance optimized
- 🎯 Production mode support (optional)
- 🔄 Real-time log updates

## Installation

```bash
npm install nuxt-dev-console
# or
yarn add nuxt-dev-console
```

## Update Module
```bash
npm install @opto-code/nuxt-dev-console@latest
```

## Setup

Add `nuxt-dev-console` to your `nuxt.config.js`:

```js
export default defineNuxtConfig({
  modules: ["nuxt-dev-console"],
  devConsole: {
    // Basic configuration
    enabled: true, // Enable/disable the console

    // Appearance
    position: "bottom-right", // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    theme: "dark", // 'dark' | 'light' | 'system'
    height: 300, // Initial height in pixels
    width: 400, // Initial width in pixels

    // Behavior
    maxLogHistory: 100, // Maximum number of logs to keep
    allowProduction: false, // Allow console in production

    // Keyboard shortcuts
    shortcuts: {
      toggle: "ctrl+shift+d", // Toggle console visibility
      clear: "ctrl+l", // Clear console
    },

    // Filtering options
    filters: {
      showTimestamp: true, // Show timestamps with logs
      showLogLevel: true, // Show log levels
      minLevel: "info", // Minimum log level to display ('info' | 'warn' | 'error')
    },
  },
});
```

## Usage

### Basic Usage

The DevConsole will be automatically available in development mode. You can use it through the composables:

```js
// Using the log composable
const devLog = useDevLog();

// Basic logging functions
devLog.log("Hello");
devLog.error("Error message");
devLog.warn("Warning message");
devLog.info("Info message");

// Browser console control
devLog.enableBrowserConsole(); // Enable browser console logging
devLog.disableBrowserConsole(); // Disable browser console logging

// Clear logs
devLog.clear();

// Access logs array
console.log(devLog.logs.value);

// Using the error handler composable (automatically handles Nuxt and Vue errors)
const errorHandler = useNuxtErrorHandler();
```

### Keyboard Shortcuts

Default shortcuts (customizable):

- `Ctrl+Shift+D`: Toggle console visibility
- `Ctrl+L`: Clear console

### Theme Support

The console supports three theme modes:

- `dark`: Dark theme
- `light`: Light theme
- `system`: Automatically matches system preferences

### Production Usage

By default, the console is disabled in production. To enable it:

```js
devConsole: {
  allowProduction: true;
}
```

⚠️ Warning: Enabling the console in production should be done with caution.

### Filtering

The console provides several filtering options:

- Search by text
- Filter by log level
- Show/hide timestamps
- Minimum log level threshold

## TypeScript Support

The module includes full TypeScript support with type definitions for all options and APIs.

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a Pull Request.

## License

[MIT License](./LICENSE)

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
