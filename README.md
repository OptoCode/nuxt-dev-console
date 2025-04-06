# nuxt-dev-console

A powerful development console for Nuxt 3 applications with advanced logging, filtering, and debugging capabilities.

## Features

- 🎨 Customizable theme (dark/light/system) with custom theme support
- 📍 Flexible positioning and resizable interface
- ⌨️ Configurable keyboard shortcuts
- 🔍 Advanced filtering and search capabilities
- 🏷️ Tag-based log organization
- 📋 Copy and export functionality (JSON, CSV, TXT)
- 💾 Persistent storage with quota management
- ⚡ Performance optimized with log queuing
- 🎯 Production mode support (optional)
- 🔄 Real-time log updates
- 📊 Log grouping and collapsible sections
- 🔒 Type-safe logging with TypeScript support

## Installation

```bash
npm install @opto-code/nuxt-dev-console
# or
yarn add @opto-code/nuxt-dev-console
# or
pnpm add @opto-code/nuxt-dev-console
```

## Setup

Add `nuxt-dev-console` to your `nuxt.config.js`:

```js
export default defineNuxtConfig({
  modules: ["@opto-code/nuxt-dev-console"],
  devConsole: {
    // Basic configuration
    enabled: true, // Enable/disable the console
    allowProduction: false, // Allow console in production

    // Appearance
    position: "bottom-right", // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    theme: "dark", // 'dark' | 'light' | 'system'
    height: 600, // Initial height in pixels
    width: 800, // Initial width in pixels

    // Custom theme (optional)
    customTheme: {
      dark: {
        background: '#1a1a1a',
        text: '#ffffff',
      },
      light: {
        background: '#ffffff',
        text: '#000000',
      }
    },

    // Performance
    maxLogHistory: 1000, // Maximum number of logs to keep
    queueSize: 1000, // Maximum size of the log queue

    // Keyboard shortcuts
    shortcuts: {
      toggle: "ctrl+shift+d", // Toggle console visibility
      clear: "ctrl+l", // Clear console
      search: "ctrl+f", // Focus search
    },

    // Display options
    filters: {
      showTimestamp: true, // Show timestamps with logs
      showLogLevel: true, // Show log levels
      minLevel: "info", // Minimum log level ('debug' | 'info' | 'warn' | 'error')
    },
  },
});
```

## Usage

### Basic Logging

The DevLogger is automatically injected into your Nuxt app and is available as `$devLogger`:

```js
// In your components/pages
export default defineComponent({
  setup() {
    const { $devLogger } = useNuxtApp();

    // Basic logging
    $devLogger.log("Hello world");
    $devLogger.info("User logged in", { userId: 123 });
    $devLogger.warn("Deprecated feature used");
    $devLogger.error("Operation failed", new Error("Details"));
    $devLogger.debug("Debug information");

    // Tagged logging
    $devLogger.logWithTags(['auth', 'user'], 'User authenticated');
    $devLogger.errorWithTags(['api'], 'API request failed');

    // Log groups
    $devLogger.group('API Requests');
    $devLogger.log('GET /api/users');
    $devLogger.log('POST /api/data');
    $devLogger.groupEnd();
  }
});
```

### Log Organization

```js
// In your components/pages
const { $devLogger } = useNuxtApp();

// Create log groups
$devLogger.group('User Authentication');
$devLogger.info('Login attempt');
$devLogger.log('Validation passed');
$devLogger.groupEnd();

// Use tags for filtering
$devLogger.logWithTags(['auth', 'success'], 'Login successful');
$devLogger.errorWithTags(['api', 'error'], 'API timeout');
```

### Export and Storage

```js
// In your components/pages
const { $devLogger } = useNuxtApp();

// Export logs programmatically
$devLogger.exportLogs(); // JSON format
$devLogger.exportLogs('csv'); // CSV format
$devLogger.exportLogs('txt'); // Text format

// Browser console control
$devLogger.enableBrowserConsole();
$devLogger.disableBrowserConsole();

// Clear logs
$devLogger.clear();
```

### Keyboard Shortcuts

Default shortcuts (all customizable):
- `Ctrl+Shift+D`: Toggle console visibility
- `Ctrl+L`: Clear console
- `Ctrl+F`: Focus search
- `Esc`: Close console

### Theme Support

```js
// In nuxt.config.js
devConsole: {
  theme: 'dark', // 'dark' | 'light' | 'system'
  customTheme: {
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      // Add more color variables
    },
    light: {
      background: '#ffffff',
      text: '#000000',
      // Add more color variables
    }
  }
}
```

### Production Usage

By default, the console is disabled in production. To enable it:

```js
devConsole: {
  allowProduction: true
}
```

⚠️ Warning: Enabling the console in production should be done with caution as it may expose sensitive debugging information.

## TypeScript Support

The module includes full TypeScript support with type definitions for:
- Configuration options
- Logger methods
- Theme customization
- Event handlers
- Plugin injections

## Documentation

For detailed documentation, see:
- [Dev Logger Documentation](./docs/dev-logger.md)
- [Dev Console Documentation](./docs/dev-console.md)

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
