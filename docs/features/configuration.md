# Configuration

This page details all available configuration options for the Nuxt Dev Console.

## Basic Configuration

Configure the Dev Console in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    enabled: true,
    // ... other options
  }
})
```

## Core Options

### Enabling/Disabling

```ts
export default defineNuxtConfig({
  devConsole: {
    enabled: true,              // Enable/disable the console
    allowProduction: false,     // Allow usage in production
    productionLevel: 'warn'     // Minimum log level in production
  }
})
```

### Display Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    position: 'bottom-right',   // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    height: 600,                // Initial height in pixels
    width: 800,                // Initial width in pixels
    minHeight: 200,            // Minimum height constraint
    minWidth: 300,             // Minimum width constraint
    maxHeight: 1000,           // Maximum height constraint
    maxWidth: 1200,            // Maximum width constraint
    opacity: 0.95,             // Console opacity (0-1)
    zIndex: 9999              // Z-index for the console
  }
})
```

### Theme Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    theme: 'system',           // 'dark' | 'light' | 'system'
    customTheme: {
      dark: {
        background: '#1a1a1a',
        text: '#ffffff',
        success: '#4caf50',
        info: '#2196f3',
        warning: '#ff9800',
        error: '#f44336',
        muted: '#9e9e9e'
      },
      light: {
        background: '#ffffff',
        text: '#000000',
        success: '#43a047',
        info: '#1e88e5',
        warning: '#fb8c00',
        error: '#e53935',
        muted: '#757575'
      }
    }
  }
})
```

## Logger Configuration

### Queue Settings

```ts
export default defineNuxtConfig({
  devConsole: {
    logger: {
      queueSize: 1000,         // Maximum number of logs to keep
      flushInterval: 100,      // Queue processing interval (ms)
      dropOldest: true,        // Drop oldest logs when queue is full
      groupTimeout: 5000,      // Auto-close groups after timeout (ms)
      maxGroupDepth: 10        // Maximum nesting level for groups
    }
  }
})
```

### Log Levels

```ts
export default defineNuxtConfig({
  devConsole: {
    logger: {
      level: 'debug',          // Minimum log level to show
      levels: {
        debug: true,           // Enable/disable specific levels
        log: true,
        info: true,
        warn: true,
        error: true
      }
    }
  }
})
```

### Storage Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    storage: {
      enabled: true,           // Enable log persistence
      maxSize: 5242880,       // Maximum storage size (5MB)
      key: 'nuxt-dev-console', // Storage key
      ttl: 86400              // Time to live in seconds (24h)
    }
  }
})
```

## Keyboard Shortcuts

```ts
export default defineNuxtConfig({
  devConsole: {
    shortcuts: {
      toggle: 'ctrl+shift+d',  // Toggle console visibility
      clear: 'ctrl+l',         // Clear console
      search: 'ctrl+f',        // Focus search input
      close: 'esc'            // Close/minimize console
    }
  }
})
```

## Performance Options

```ts
export default defineNuxtConfig({
  devConsole: {
    performance: {
      virtualScrolling: true,   // Enable virtual scrolling
      maxRenderItems: 100,     // Maximum items to render at once
      debounceTime: 16,        // Debounce time for updates (ms)
      lazyLoading: true        // Enable lazy loading of log content
    }
  }
})
```

## Export Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    export: {
      formats: ['json', 'csv', 'txt'],  // Available export formats
      maxExportSize: 10485760,          // Maximum export size (10MB)
      includeMetadata: true,            // Include metadata in exports
      dateFormat: 'ISO'                 // Date format in exports
    }
  }
})
```

## Filter Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    filters: {
      preserveFilters: true,    // Preserve filters between sessions
      maxSearchHistory: 50,     // Maximum search history entries
      caseSensitive: false,     // Case-sensitive search
      regexSearch: true         // Enable regex in search
    }
  }
})
```

## Network Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    network: {
      captureRequests: true,    // Capture network requests
      captureWebSockets: true,  // Capture WebSocket traffic
      maxRequestSize: 5242880,  // Maximum request size to capture (5MB)
      excludePatterns: [        // Patterns to exclude from capture
        '/socket.io/',
        '/__webpack_hmr'
      ]
    }
  }
})
```

## TypeScript Interface

```ts
interface DevConsoleConfig {
  enabled?: boolean
  allowProduction?: boolean
  productionLevel?: 'debug' | 'log' | 'info' | 'warn' | 'error'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  height?: number
  width?: number
  theme?: 'dark' | 'light' | 'system'
  customTheme?: {
    dark: ThemeColors
    light: ThemeColors
  }
  logger?: LoggerConfig
  storage?: StorageConfig
  shortcuts?: ShortcutConfig
  performance?: PerformanceConfig
  export?: ExportConfig
  filters?: FilterConfig
  network?: NetworkConfig
}
```

## Best Practices

1. Start with minimal configuration and add options as needed
2. Use environment variables for sensitive settings
3. Adjust performance options based on application size
4. Configure appropriate log levels for different environments
5. Set reasonable storage limits to prevent memory issues

## Related

- [Dev Console Features](/features/dev-console)
- [Dev Logger Documentation](/features/dev-logger)
- [Best Practices](/advanced/best-practices)
- [Theme Customization](/advanced/theme-customization) 