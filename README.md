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

Add `@opto-code/nuxt-dev-console` to your `nuxt.config.js`:

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

There are two ways to use the dev console in your Nuxt application:

### 1. Using the DevConsole Component

The most flexible way is to use the DevConsole component directly:

```vue
<template>
  <div>
    <!-- Your app content -->
    <DevConsole ref="devConsole" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Get a reference to the DevConsole
const devConsole = ref(null)

// Use tag-enabled logging methods
const logExample = () => {
  // Basic tagged logging
  devConsole.value?.logWithTags(['user', 'auth'], 'User logged in', { userId: 123 })
  
  // Error logging with tags
  devConsole.value?.errorWithTags(
    ['api', 'error'], 
    'API request failed',
    new Error('Network error')
  )
  
  // Warning with performance tags
  devConsole.value?.warnWithTags(
    ['performance', 'api'], 
    'Slow API response',
    { endpoint: '/users', duration: '500ms' }
  )
  
  // Info with feature tags
  devConsole.value?.infoWithTags(
    ['feature', 'beta'], 
    'New feature accessed',
    { featureId: 'x-123' }
  )
}
</script>
```

### 2. Using the Global DevLogger

The module also provides a global `$devLogger` that's automatically injected:

```js
// In your components/pages
export default defineComponent({
  setup() {
    const { $devLogger } = useNuxtApp()

    // Basic logging
    $devLogger.log("Hello world")
    $devLogger.info("User logged in", { userId: 123 })
    $devLogger.warn("Deprecated feature used")
    $devLogger.error("Operation failed", new Error("Details"))
    $devLogger.debug("Debug information")

    // Log groups
    $devLogger.group('API Requests')
    $devLogger.log('GET /api/users')
    $devLogger.log('POST /api/data')
    $devLogger.groupEnd()
  }
})
```

### Advanced Features

#### Tag-Based Logging

Use tags to organize and filter your logs:

```js
// Feature tracking
devConsole.value?.logWithTags(
  ['feature', 'beta', 'usage'],
  'Feature accessed',
  { featureId: 'x-123', user: 'john' }
)

// Error tracking
devConsole.value?.errorWithTags(
  ['database', 'query', 'error'],
  'Query failed',
  { query: 'SELECT...', error: 'Timeout' }
)

// Performance monitoring
devConsole.value?.warnWithTags(
  ['performance', 'api', 'latency'],
  'High latency detected',
  { endpoint: '/api/users', duration: '2500ms' }
)

// Configuration changes
devConsole.value?.infoWithTags(
  ['config', 'system'],
  'Config updated',
  { changes: { theme: 'dark' } }
)
```

Common tag categories:
- Feature areas: 'auth', 'api', 'database', 'ui'
- Log types: 'error', 'warning', 'debug'
- Environment: 'dev', 'staging', 'prod'
- Components: 'frontend', 'backend', 'middleware'
- Status: 'success', 'failure', 'pending'

#### Log Organization

```js
// Group related logs
devConsole.value?.group('User Authentication')
devConsole.value?.logWithTags(['auth'], 'Login attempt')
devConsole.value?.logWithTags(['auth', 'success'], 'Validation passed')
devConsole.value?.groupEnd()

// Track API calls
devConsole.value?.group('API Requests')
devConsole.value?.logWithTags(['api', 'request'], 'GET /api/users')
devConsole.value?.logWithTags(['api', 'response'], 'Response received')
devConsole.value?.groupEnd()
```

#### Export and Storage

```js
// Export logs programmatically
devConsole.value?.exportLogs() // JSON format
devConsole.value?.exportLogs('csv') // CSV format
devConsole.value?.exportLogs('txt') // Text format

// Clear logs
devConsole.value?.clear()
```

### Best Practices

1. **Consistent Tag Usage**
   ```js
   // Good - consistent tag categories
   devConsole.value?.logWithTags(['auth', 'user'], 'Login')
   devConsole.value?.logWithTags(['auth', 'session'], 'Session created')
   
   // Avoid - inconsistent tag naming
   devConsole.value?.logWithTags(['authentication'], 'Login')
   devConsole.value?.logWithTags(['auth'], 'Session created')
   ```

2. **Meaningful Data Objects**
   ```js
   // Good - includes relevant data
   devConsole.value?.logWithTags(['api'], 'Request completed', {
     endpoint: '/users',
     duration: '100ms',
     status: 200
   })
   
   // Avoid - missing context
   devConsole.value?.logWithTags(['api'], 'Request completed')
   ```

3. **Hierarchical Tags**
   ```js
   // Good - hierarchical organization
   devConsole.value?.logWithTags(['ui', 'button', 'click'], 'Button clicked')
   devConsole.value?.logWithTags(['ui', 'form', 'submit'], 'Form submitted')
   ```

4. **Error Context**
   ```js
   // Good - includes error object and context
   devConsole.value?.errorWithTags(['api', 'error'], 'API failed', {
     error: new Error('Network timeout'),
     request: { url, method, params }
   })
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
