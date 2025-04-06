# TypeScript Support

The Nuxt Dev Console is built with TypeScript and provides comprehensive type support for all its features.

## Type Definitions

### Core Types

```ts
// Main configuration type
interface DevConsoleConfig {
  enabled?: boolean
  allowProduction?: boolean
  productionLevel?: LogLevel
  position?: ConsolePosition
  height?: number
  width?: number
  theme?: ThemeMode
  customTheme?: ThemeConfig
  logger?: LoggerConfig
  storage?: StorageConfig
  shortcuts?: ShortcutConfig
  performance?: PerformanceConfig
  export?: ExportConfig
  filters?: FilterConfig
  network?: NetworkConfig
}

// Theme types
type ThemeMode = 'dark' | 'light' | 'system'
type ConsolePosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error'

interface ThemeConfig {
  dark: ThemeColors
  light: ThemeColors
}

interface ThemeColors {
  background: string
  text: string
  success: string
  info: string
  warning: string
  error: string
  muted: string
  border?: string
  accent?: string
  highlight?: string
}
```

### Logger Types

```ts
interface LoggerConfig {
  level?: LogLevel
  levels?: Record<LogLevel, boolean>
  queueSize?: number
  flushInterval?: number
  dropOldest?: boolean
  groupTimeout?: number
  maxGroupDepth?: number
}

interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  message: string
  data?: any
  stack?: string
  groupId?: string
  groupCollapsed?: boolean
}

type LogMethod = (...args: any[]) => void
```

### Component Props

```ts
interface DevConsoleProps {
  position?: ConsolePosition
  height?: number
  width?: number
  theme?: ThemeMode
  opacity?: number
  zIndex?: number
  shortcuts?: ShortcutConfig
}

interface LogViewerProps {
  entries: LogEntry[]
  filter?: string
  theme?: ThemeColors
  virtualScroll?: boolean
  maxRenderItems?: number
}
```

## Runtime Type Safety

### Type-Safe Configuration

```ts
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'
import { DevConsoleConfig } from '@opto-code/nuxt-dev-console'

export default defineNuxtConfig({
  devConsole: {
    enabled: true,
    theme: 'system', // TypeScript will ensure this is 'dark' | 'light' | 'system'
    position: 'bottom-right' // TypeScript will ensure valid position
  } satisfies DevConsoleConfig
})
```

### Composable Types

```ts
// In your components
import { useNuxtDevConsole } from '@opto-code/nuxt-dev-console'

export default defineComponent({
  setup() {
    const devConsole = useNuxtDevConsole()

    // Type-safe logging methods
    devConsole.log('Hello', { data: 123 })
    devConsole.info('Info message')
    devConsole.warn('Warning message')
    devConsole.error('Error message', new Error('Details'))

    // Type-safe theme management
    devConsole.setTheme('dark') // TypeScript ensures valid theme
    devConsole.updateTheme({
      dark: {
        background: '#000000',
        text: '#ffffff'
      }
    }) // TypeScript ensures valid theme structure
  }
})
```

### Plugin Types

```ts
// plugins/custom-logger.ts
import { defineNuxtPlugin } from 'nuxt'
import type { DevConsole } from '@opto-code/nuxt-dev-console'

export default defineNuxtPlugin((nuxtApp) => {
  const devConsole = nuxtApp.$devConsole as DevConsole

  // Type-safe custom logging method
  const logWithTimestamp = (message: string, ...args: any[]) => {
    devConsole.log(`[${new Date().toISOString()}] ${message}`, ...args)
  }

  return {
    provide: {
      customLog: logWithTimestamp
    }
  }
})
```

## Type Utilities

### Custom Type Guards

```ts
import { isLogEntry, isLogLevel, isThemeMode } from '@opto-code/nuxt-dev-console'

// Type guard for log entries
function processLogEntry(entry: unknown) {
  if (isLogEntry(entry)) {
    // TypeScript knows entry is LogEntry here
    console.log(entry.message)
  }
}

// Type guard for log levels
function setLogLevel(level: unknown) {
  if (isLogLevel(level)) {
    // TypeScript knows level is LogLevel here
    config.logLevel = level
  }
}

// Type guard for theme modes
function setThemeMode(mode: unknown) {
  if (isThemeMode(mode)) {
    // TypeScript knows mode is ThemeMode here
    config.theme = mode
  }
}
```

### Utility Types

```ts
import type {
  DeepPartial,
  LogLevelUnion,
  ThemeModeUnion,
  ConsolePositionUnion
} from '@opto-code/nuxt-dev-console'

// Partial theme configuration
type PartialTheme = DeepPartial<ThemeConfig>

// Union types
const logLevels: LogLevelUnion[] = ['debug', 'log', 'info', 'warn', 'error']
const themeModes: ThemeModeUnion[] = ['dark', 'light', 'system']
const positions: ConsolePositionUnion[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left']
```

## Best Practices

1. **Type Assertions**
   - Minimize use of type assertions (`as`)
   - Use type guards when working with unknown data
   - Leverage TypeScript's type inference

2. **Configuration Types**
   - Use `satisfies` operator for config validation
   - Define strict types for custom configurations
   - Avoid `any` in configuration objects

3. **Component Props**
   - Define prop types explicitly
   - Use required props when necessary
   - Provide default values for optional props

4. **Error Handling**
   - Use typed error classes
   - Handle type-specific error cases
   - Maintain type safety in catch blocks

## Related

- [Configuration Guide](/features/configuration)
- [Theme Customization](/advanced/theme-customization)
- [Best Practices](/advanced/best-practices) 