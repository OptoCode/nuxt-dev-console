# Dev Logger

The Dev Logger provides a powerful logging utility specifically designed for Nuxt applications, offering enhanced logging capabilities in development mode while ensuring zero overhead in production.

## Features

- Development-mode focused logging
- Queue-based logging system
- Automatic console method capture
- Tag-based organization
- Group support
- Performance timing
- TypeScript support

## Basic Usage

### Global Logger

Access the logger through the Nuxt app:

```ts
const { $devLogger } = useNuxtApp()

// Basic logging
$devLogger.log('Hello world')
$devLogger.info('Server started', { port: 3000 })
$devLogger.warn('Deprecated feature used')
$devLogger.error('Operation failed', new Error('Details'))
```

### Browser Console

In development mode, access the logger globally:

```ts
// In browser console
window.$devLogger.log('Testing from console')
window.$devLogger.table(data)
```

## Advanced Features

### Log Groups

Organize related logs:

```ts
$devLogger.group('User Authentication')
$devLogger.info('Attempting login...')
$devLogger.log('Credentials validated')
$devLogger.info('Login successful')
$devLogger.groupEnd()

// Collapsed by default
$devLogger.groupCollapsed('API Requests')
$devLogger.log('GET /api/users')
$devLogger.log('POST /api/data')
$devLogger.groupEnd()
```

### Performance Timing

Measure operation durations:

```ts
$devLogger.time('dataFetch')
await fetchData()
$devLogger.timeEnd('dataFetch') // Outputs: [DevLogger] dataFetch: 1234ms

// Multiple concurrent timers
$devLogger.time('operation1')
$devLogger.time('operation2')
// ... operations ...
$devLogger.timeEnd('operation2')
$devLogger.timeEnd('operation1')
```

### Data Inspection

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

### Debugging

```ts
// Stack traces
$devLogger.trace('Trace message')

// Conditional logging
$devLogger.assert(value > 0, 'Value must be positive', { value })
```

## Available Methods

| Method | Description |
|--------|-------------|
| `log` | Standard log message |
| `info` | Informational message |
| `warn` | Warning message |
| `error` | Error message |
| `debug` | Debug message |
| `group` | Start a collapsible group |
| `groupEnd` | End the current group |
| `time` | Start a timer |
| `timeEnd` | End a timer |
| `trace` | Output stack trace |
| `assert` | Conditional logging |
| `table` | Display tabular data |
| `dir` | Object inspection |
| `dirxml` | DOM element inspection |

## Configuration

### Basic Setup

```ts
export default defineNuxtConfig({
  devConsole: {
    enabled: true,
    allowProduction: false
  }
})
```

### Queue Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    logger: {
      queueSize: 1000,        // Maximum queue size
      flushInterval: 100,     // Queue processing interval (ms)
      dropOldest: true,       // Drop oldest logs when queue is full
      groupTimeout: 5000      // Auto-close groups after timeout
    }
  }
})
```

## Production Mode

By default, all logging is disabled in production. To enable it:

```ts
export default defineNuxtConfig({
  devConsole: {
    allowProduction: true,    // Enable logging in production
    productionLevel: 'warn'   // Only show warnings and errors
  }
})
```

::: warning
Enabling logging in production should be done with caution as it may expose sensitive debugging information.
:::

## Best Practices

1. Use appropriate log levels
2. Leverage groups for related logs
3. Include relevant context in logs
4. Use timers for performance tracking
5. Clear logs when they're no longer needed

## TypeScript Support

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

## Related

- [Dev Console Documentation](/features/dev-console)
- [Configuration Guide](/features/configuration)
- [Best Practices](/advanced/best-practices)
- [Contributing Guide](https://github.com/optocode/nuxt-dev-console/blob/main/CONTRIBUTING.md)
- [License](https://github.com/optocode/nuxt-dev-console/blob/main/LICENSE) 