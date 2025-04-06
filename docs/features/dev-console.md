# Dev Console

The Nuxt Dev Console is a powerful development tool that provides enhanced logging, debugging, and inspection capabilities for your Nuxt.js applications.

## Features

### Core Features
- Interactive console interface
- Real-time log monitoring
- Advanced search with history
- Tag-based filtering
- Log persistence
- Export functionality

### Visual Features
- Customizable themes (dark/light/system)
- Flexible positioning
- Resizable interface
- Color-coded log levels
- Collapsible log entries
- Virtual scrolling

## Component Usage

### Basic Integration

```vue
<template>
  <div>
    <DevConsole ref="devConsole" />
  </div>
</template>

<script setup>
const devConsole = ref(null)
</script>
```

### Positioning

The console can be positioned in four different locations:
- Bottom Right (default)
- Bottom Left
- Top Right
- Top Left

```ts
export default defineNuxtConfig({
  devConsole: {
    position: 'bottom-right' // or 'bottom-left', 'top-right', 'top-left'
  }
})
```

### Size Configuration

Customize the initial size:

```ts
export default defineNuxtConfig({
  devConsole: {
    height: 600, // Height in pixels
    width: 800   // Width in pixels
  }
})
```

### Theme Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    theme: 'dark', // 'dark', 'light', or 'system'
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
})
```

## Search and Filtering

### Text Search
- Use the search bar to filter logs by content
- Search history is preserved between sessions
- Regular expression support

### Tag Filtering
- Click on tags to filter logs
- Combine multiple tags
- Clear filters with one click

### Log Level Filtering
- Filter by log level (info, warn, error)
- Minimum log level configuration
- Color-coded levels for easy identification

## Export Options

Export your logs in multiple formats:

```ts
// JSON format
window.$devLogger.exportLogs()

// CSV format
window.$devLogger.exportLogs('csv')

// Text format
window.$devLogger.exportLogs('txt')
```

## Keyboard Controls

Default keyboard shortcuts (all customizable):

| Shortcut | Action |
|----------|---------|
| `ctrl+shift+d` | Toggle console |
| `ctrl+l` | Clear logs |
| `ctrl+f` | Focus search |
| `esc` | Close console |

Configure shortcuts:

```ts
export default defineNuxtConfig({
  devConsole: {
    shortcuts: {
      toggle: 'ctrl+shift+d',
      clear: 'ctrl+l',
      search: 'ctrl+f'
    }
  }
})
```

## Performance Considerations

The Dev Console is built with performance in mind:
- Virtual scrolling for handling large log volumes
- Automatic log pruning when exceeding quota
- Efficient log storage and retrieval
- Minimal impact on application performance

## Best Practices

1. Position the console where it won't interfere with UI testing
2. Use appropriate log levels for different types of information
3. Leverage tags for better log organization
4. Export logs when debugging complex issues
5. Clear logs regularly to maintain performance

## Related

- [Dev Logger Documentation](/features/dev-logger)
- [Configuration Guide](/features/configuration)
- [Best Practices](/advanced/best-practices)
- [Contributing Guide](https://github.com/optocode/nuxt-dev-console/blob/main/CONTRIBUTING.md)
- [License](https://github.com/optocode/nuxt-dev-console/blob/main/LICENSE)
- [Theme Customization](/advanced/theme-customization) 