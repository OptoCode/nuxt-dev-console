# @opto-code/nuxt-dev-console

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

A powerful development console for Nuxt 3 applications that provides real-time monitoring, advanced logging, filtering, and debugging capabilities with zero production overhead.

[View Demo](https://optocode.github.io/nuxt-dev-console/) · [Report Bug](https://github.com/OptoCode/nuxt-dev-console/issues) · [Request Feature](https://github.com/OptoCode/nuxt-dev-console/issues)

## ✨ Features

### 🎯 Core Features
- Interactive console interface with customizable positioning and dimensions
- Real-time log monitoring and filtering
- Advanced search capabilities with search history
- Log persistence with intelligent storage management
- Support for log groups and collapsible entries
- Multiple export formats (JSON, CSV, TXT)

### 🔍 Log Management
- Automatic log persistence between page reloads
- Intelligent quota management for localStorage
- Configurable maximum log history
- Log grouping and nesting support
- Copy-to-clipboard functionality
- Virtual scrolling for optimal performance

### 🎨 Visual Features
- Three theme modes (dark/light/system) with custom theme support
- Customizable position (top-right, top-left, bottom-right, bottom-left)
- Resizable console window
- Color-coded log levels
- Tag visualization and filtering
- Collapsible log entries

## 📦 Installation

```bash
# npm
npm install @opto-code/nuxt-dev-console

# yarn
yarn add @opto-code/nuxt-dev-console

# pnpm
pnpm add @opto-code/nuxt-dev-console
```

## 🚀 Quick Setup

1. Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    enabled: true
  }
})
```

2. Add the console component to your app:

```vue
<template>
  <div>
    <!-- Your app content -->
    <DevConsole />
  </div>
</template>
```

## 🔧 Configuration

### Basic Configuration

```ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    // Basic settings
    enabled: true,
    allowProduction: false,

    // Visual Configuration
    position: 'bottom-right',
    theme: 'dark',
    height: 600,
    width: 800,

    // Functionality
    maxLogHistory: 1000,
    queueSize: 1000,
    flushInterval: 100
  }
})
```

### Advanced Configuration

See our [Configuration Guide](./docs/dev-console.md#advanced-configuration) for detailed options.

## 📖 Usage

### Basic Logging

```ts
// Automatic console method capture
console.log('Hello World')
console.info('Server started', { port: 3000 })
console.warn('Deprecated feature used')
console.error('Connection failed', new Error('Timeout'))

// Using the global logger
const { $devLogger } = useNuxtApp()
$devLogger.log('Hello from dev logger')
```

### Tagged Logging

```ts
// Get console reference
const devConsole = ref(null)

// Log with tags for better organization
devConsole.value?.logWithTags(['user', 'auth'], 'User logged in', { userId: 123 })
devConsole.value?.errorWithTags(['api', 'error'], 'API failed', new Error('Network error'))
devConsole.value?.warnWithTags(['perf'], 'Slow operation', { latency: '500ms' })
```

### Log Groups

```ts
// Create collapsible groups
console.group('API Requests')
console.log('GET /api/users')
console.log('POST /api/data')
console.groupEnd()

// Collapsed by default
console.groupCollapsed('Performance Metrics')
console.log('Load time: 1.2s')
console.log('First paint: 0.8s')
console.groupEnd()
```

### Export Functionality

```ts
// Export logs programmatically
window.$devLogger.exportLogs()         // JSON format
window.$devLogger.exportLogs('csv')    // CSV format
window.$devLogger.exportLogs('txt')    // Text format
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|---------|
| `ctrl+shift+d` | Toggle console visibility |
| `ctrl+l` | Clear console |
| `ctrl+f` | Focus search bar |
| `esc` | Close console |

## 🎨 Theme Customization

```ts
devConsole: {
  theme: 'dark',
  customTheme: {
    dark: {
      background: '#1a1a1a',
      text: '#ffffff'
    },
    light: {
      background: '#ffffff',
      text: '#000000'
    }
  }
}
```

## 📚 Best Practices

### Log Organization
1. Use consistent tag naming across your application
2. Combine broad and specific tags for better filtering
3. Include relevant data objects with your logs
4. Use log groups for related operations
5. Add timestamps for time-sensitive operations

### Performance
1. Configure appropriate `maxLogHistory` for your needs
2. Regularly clear old logs to maintain performance
3. Use tag filtering to focus on relevant information
4. Export logs for long-term storage or analysis

### Development Workflow
1. Position the console where it won't interfere with UI testing
2. Use keyboard shortcuts for faster navigation
3. Utilize search history for common queries
4. Export logs when debugging complex issues
5. Configure appropriate log levels for different environments

## 🔒 TypeScript Support

The module includes full TypeScript definitions for all features:

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
  // ... more methods
}
```

## 📘 Documentation

- [Dev Console Documentation](./docs/dev-console.md) - UI component details
- [Dev Logger Documentation](./docs/dev-logger.md) - Logging utility details
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Changelog](./CHANGELOG.md) - Version history

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Released under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- [Nuxt](https://nuxt.com) - The Intuitive Vue Framework
- [Vue.js](https://vuejs.org) - The Progressive JavaScript Framework
- [Vuetify](https://vuetifyjs.com) - Material Design Framework

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@opto-code/nuxt-dev-console/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@opto-code/nuxt-dev-console

[npm-downloads-src]: https://img.shields.io/npm/dm/@opto-code/nuxt-dev-console.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@opto-code/nuxt-dev-console

[license-src]: https://img.shields.io/npm/l/@opto-code/nuxt-dev-console.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@opto-code/nuxt-dev-console
