# Quick Start Guide

This guide will help you get up and running with Nuxt Dev Console quickly.

## Basic Setup

1. Add the console component to your app:

```vue
<template>
  <div>
    <!-- Your app content -->
    <DevConsole />
  </div>
</template>
```

## Basic Usage

### Console Methods

The console automatically captures all standard console methods:

```ts
// These will be captured and displayed in the dev console
console.log('Hello World')
console.info('Server started', { port: 3000 })
console.warn('Deprecated feature used')
console.error('Connection failed', new Error('Timeout'))
```

### Using the Dev Logger

You can also use the injected `$devLogger`:

```ts
const { $devLogger } = useNuxtApp()

$devLogger.log('Hello from dev logger')
$devLogger.info('User logged in', { userId: 123 })
$devLogger.warn('Performance warning', { latency: '500ms' })
```

### Tagged Logging

Organize your logs with tags:

```ts
const devConsole = ref(null)

// Log with tags for better organization
devConsole.value?.logWithTags(
  ['user', 'auth'], 
  'User logged in', 
  { userId: 123 }
)

devConsole.value?.errorWithTags(
  ['api', 'error'], 
  'API failed', 
  new Error('Network error')
)
```

### Log Groups

Group related logs together:

```ts
console.group('API Requests')
console.log('GET /api/users')
console.log('POST /api/data')
console.groupEnd()

// Or use collapsed groups
console.groupCollapsed('Performance Metrics')
console.log('Load time: 1.2s')
console.log('First paint: 0.8s')
console.groupEnd()
```

## Keyboard Shortcuts

Default shortcuts (customizable):
- `Ctrl+Shift+D`: Toggle console visibility
- `Ctrl+L`: Clear console
- `Ctrl+F`: Focus search
- `Esc`: Close console

## Next Steps

- [Configuration Guide](/features/configuration)
- [Dev Console Features](/features/dev-console)
- [Dev Logger Documentation](/features/dev-logger)
- [Theme Customization](/advanced/theme-customization)
- Read about [best practices](/advanced/best-practices) 