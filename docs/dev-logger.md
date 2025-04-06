# Nuxt Development Logger

The Development Logger is a powerful debugging and logging utility designed specifically for Nuxt applications. It provides enhanced logging capabilities in development mode while ensuring zero overhead in production.

## 🎯 Key Features

### Core Functionality
- Development-mode focused logging with zero production overhead
- Intelligent queue system for handling high-volume logging
- Automatic overflow protection and memory management
- TypeScript support out of the box
- Global browser console access via `window.$devLogger`

### Logging Capabilities
- Support for all standard console methods
- Log grouping and organization
- Performance timing utilities
- Table and object inspection tools
- Stack trace support
- Assertion handling

### Performance & Safety
- Queue-based logging system with configurable limits
- Automatic overflow protection
- Configurable flush intervals
- Safe production mode with no-op functions
- Memory-efficient log processing

## Installation

The Development Logger is included as part of the Nuxt Dev Console module:

```bash
# npm
npm install @opto-code/nuxt-dev-console

# yarn
yarn add @opto-code/nuxt-dev-console

# pnpm
pnpm add @opto-code/nuxt-dev-console
```

## Basic Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    enabled: true,
    allowProduction: false,
    maxLogHistory: 1000,
    queueSize: 1000,
    flushInterval: 100 // milliseconds
  }
})
```

## Usage Guide

### Basic Logging

```ts
// In your Vue components or Nuxt pages
const { $devLogger } = useNuxtApp()

// Basic logging
$devLogger.log('Hello World')
$devLogger.info('Server started', { port: 3000 })
$devLogger.warn('Deprecated feature used', { feature: 'oldAPI' })
$devLogger.error('Connection failed', new Error('Timeout'))
```

### Advanced Logging Features

#### Log Groups
```ts
// Expanded groups
$devLogger.group('Authentication Flow')
$devLogger.info('User attempting login...')
$devLogger.log('Validating credentials...')
$devLogger.info('Login successful')
$devLogger.groupEnd()

// Collapsed groups (hidden by default)
$devLogger.groupCollapsed('API Requests')
$devLogger.log('GET /api/users')
$devLogger.log('POST /api/data')
$devLogger.groupEnd()
```

#### Performance Monitoring
```ts
// Time operations
$devLogger.time('dataFetch')
await fetchData()
$devLogger.timeEnd('dataFetch') // Outputs: [DevLogger] dataFetch: 1234ms

// Multiple timers
$devLogger.time('operation1')
$devLogger.time('operation2')
// ... operations ...
$devLogger.timeEnd('operation2')
$devLogger.timeEnd('operation1')
```

#### Data Inspection
```ts
// Table format for array data
$devLogger.table([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'user' }
])

// Object inspection
$devLogger.dir(complexObject, { depth: 2, colors: true })

// DOM element inspection
$devLogger.dirxml(document.body)
```

#### Debugging
```ts
// Stack traces
$devLogger.trace('Trace message')

// Conditional logging
$devLogger.assert(value > 0, 'Value must be positive', { value })
```

### Browser Console Access

During development, the logger is globally available in the browser:

```ts
// Browser console
window.$devLogger.log('Testing from console')
window.$devLogger.table(data)
window.$devLogger.time('operation')
```

## Advanced Configuration

### Queue System Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    logger: {
      queueSize: 2000,        // Maximum queue size (default: 1000)
      flushInterval: 200,     // Queue processing interval in ms (default: 100)
      dropOldest: true,       // Drop oldest logs when queue is full (default: true)
      groupTimeout: 5000      // Auto-close groups after timeout (default: 5000ms)
    }
  }
})
```

### Production Mode

By default, all logging is disabled in production. To enable it:

```ts
export default defineNuxtConfig({
  devConsole: {
    allowProduction: true,    // Enable logging in production
    productionLevel: 'warn'   // Only show warnings and errors in production
  }
})
```

## Best Practices

### Performance Optimization
1. Use appropriate log levels for different types of information
2. Utilize collapsed groups for verbose logging
3. Consider queue size and flush interval for high-volume logging
4. Clean up timers and groups when done

### Development Workflow
1. Use table() for debugging array/object data
2. Leverage time() for performance bottleneck identification
3. Group related logs for better organization
4. Use assert() for development-time validation

### Production Safety
1. Avoid sensitive information in logs
2. Use standard console.error() for critical production errors
3. Consider log levels when enabling production logging
4. Clean up all development-only logging code

## TypeScript Support

The Development Logger includes full TypeScript definitions:

```ts
interface DevLogger {
  log(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  debug(...args: any[]): void
  group(label: string): void
  groupEnd(): void
  time(label: string): void
  timeEnd(label: string): void
  trace(...args: any[]): void
  assert(condition: boolean, ...args: any[]): void
  table(tabularData?: any, properties?: string[]): void
  dir(item?: any, options?: any): void
  dirxml(value: any): void
}
```

## Error Handling

The logger implements robust error handling:

- Queue overflow protection
- Safe error handling for failed log attempts
- Automatic cleanup on component unmount
- Graceful degradation in unsupported environments

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[MIT License](LICENSE)
