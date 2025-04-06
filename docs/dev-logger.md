# Development Logger

The Nuxt Dev Console module provides a development-only logger that allows you to log messages only when your Nuxt application is running in development mode. This is useful for debugging and development without cluttering the console in production.

## Features

- Only logs in development mode (or when `allowProduction` is set to `true`)
- Prefixes all logs with `[DevLogger]` for easy identification
- Supports all standard console methods (log, info, warn, error, etc.)
- Queue system for handling rapid logging with automatic overflow protection
- Available as a Nuxt plugin with TypeScript support
- Also available as a global `$devLogger` object in the browser

## Usage

### Basic Usage

```vue
<script setup>
// Import the logger from the Nuxt app context
const { $devLogger } = useNuxtApp();

// Use it in your component
function someFunction() {
  $devLogger.log('This message only appears in development mode');
  $devLogger.info('User logged in', { userId: 123 });
  $devLogger.warn('Deprecated feature used');
  $devLogger.error('Something went wrong', new Error('Error details'));
}
</script>
```

### Log Groups and Organization

```js
// Create a log group
$devLogger.group('User Authentication');
$devLogger.info('Attempting login...');
$devLogger.log('Credentials validated');
$devLogger.groupEnd();

// Create a collapsed group
$devLogger.groupCollapsed('API Requests');
$devLogger.log('GET /api/users');
$devLogger.log('POST /api/data');
$devLogger.groupEnd();
```

### Available Methods

The development logger supports all standard console methods:

- `$devLogger.log(...args)` - Standard log message
- `$devLogger.info(...args)` - Informational message
- `$devLogger.warn(...args)` - Warning message
- `$devLogger.error(...args)` - Error message
- `$devLogger.debug(...args)` - Debug message
- `$devLogger.group(label)` - Start a collapsible group in the console
- `$devLogger.groupEnd()` - End the current group
- `$devLogger.time(label)` - Start a timer with the given label
- `$devLogger.timeEnd(label)` - End the timer with the given label and log the elapsed time
- `$devLogger.trace(...args)` - Output a stack trace
- `$devLogger.assert(condition, ...args)` - Log a message if the condition is false
- `$devLogger.table(data, columns)` - Display tabular data as a table
- `$devLogger.dir(obj, options)` - Display an interactive list of the properties of the specified object
- `$devLogger.dirxml(obj)` - Display an XML/HTML Element representation of the specified object

### Global Access

In development mode, the logger is also available as a global `window.$devLogger` object, which can be useful for debugging in the browser console:

```js
// In the browser console (development mode only)
window.$devLogger.log('Testing from console');
window.$devLogger.table([{ name: 'John', age: 30 }, { name: 'Jane', age: 28 }]);
```

## Configuration

The development logger is automatically enabled in development mode. In production, all logger methods become no-op functions (they do nothing) unless you explicitly enable production logging.

To configure the logger, use the `devConsole` options in your `nuxt.config.js`:

```js
// nuxt.config.js
export default defineNuxtConfig({
  devConsole: {
    enabled: true,
    allowProduction: false, // Enable in production mode
    maxLogHistory: 1000, // Maximum number of logs to keep in memory
  }
})
```

## Best Practices

1. Use the development logger for debugging and development information that shouldn't appear in production.
2. Use appropriate log levels (info, warn, error) based on the importance of the message.
3. For critical errors that should always be logged, use the standard `console.error()` instead.
4. Use groups to organize related logs and make the console output more readable.
5. Use `time()` and `timeEnd()` to measure performance of operations during development.
6. Take advantage of the queue system's automatic handling for rapid logging scenarios.
