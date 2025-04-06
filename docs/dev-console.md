# Nuxt Dev Console

The Nuxt Dev Console is a powerful development and debugging tool that provides real-time monitoring, logging, and debugging capabilities for your Nuxt applications. It offers a modern, feature-rich interface with advanced filtering, search, and organization capabilities.

## Key Features

### 🎯 Core Features
- Interactive console interface with customizable positioning and dimensions
- Real-time log monitoring and filtering
- Advanced search capabilities with search history
- Log persistence with intelligent storage management
- Support for log groups and collapsible entries
- Multiple export formats (JSON, CSV, TXT)
- Customizable themes (dark, light, system)
- Keyboard shortcuts for quick access
- Tag-based log organization and filtering

### 🔍 Log Management
- Automatic log persistence between page reloads
- Intelligent quota management for localStorage
- Configurable maximum log history
- Log grouping and nesting support
- Copy-to-clipboard functionality for log entries
- Virtual scrolling for optimal performance
w 
### 🎨 Visual Features
- Three theme modes (dark, light, system)
- Customizable position (top-right, top-left, bottom-right, bottom-left)
- Resizable console window
- Color-coded log levels
- Collapsible log entries
- Tag visualization and filtering

## Installation

```bash
# npm
npm install @opto-code/nuxt-dev-console

# yarn
yarn add @opto-code/nuxt-dev-console

# pnpm
pnpm add @opto-code/nuxt-dev-console
```

## Basic Configuration

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    enabled: true
  }
})
```

## Advanced Configuration

### Full Configuration Options

```ts
export default defineNuxtConfig({
  devConsole: {
    // Visual Configuration
    position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    theme: 'dark', // 'dark' | 'light' | 'system'
    height: 600, // Height in pixels
    width: 800, // Width in pixels
    
    // Functionality
    enabled: true,
    maxLogHistory: 1000,
    
    // Keyboard Shortcuts
    shortcuts: {
      toggle: 'ctrl+shift+d',
      clear: 'ctrl+l'
    },
    
    // Log Display Options
    filters: {
      showTimestamp: true,
      showLogLevel: true,
      minLevel: 'info' // 'debug' | 'info' | 'warn' | 'error'
    }
  }
})
```

## Usage

### Basic Logging

```ts
// Standard console methods are automatically captured
console.log('Hello World');
console.info('Information message');
console.warn('Warning message');
console.error('Error message');
```

### Tagged Logging

```ts
// Get reference to the DevConsole component
const devConsole = ref(null);

// Log with tags for better organization
devConsole.value.logWithTags(['user', 'auth'], 'User logged in', { userId: 123 });
devConsole.value.errorWithTags(['api', 'error'], 'API request failed', new Error('Network error'));
devConsole.value.warnWithTags(['performance'], 'Slow operation detected', { latency: '500ms' });
devConsole.value.infoWithTags(['config'], 'Config loaded', { environment: 'production' });
```

### Log Groups

```ts
// Create collapsible log groups
console.group('API Requests');
console.log('GET /api/users');
console.log('POST /api/data');
console.groupEnd();

// Or use collapsed groups
console.groupCollapsed('Performance Metrics');
console.log('Load time: 1.2s');
console.log('First paint: 0.8s');
console.groupEnd();
```

### Exporting Logs

```ts
// Programmatic export
window.$devLogger.exportLogs(); // JSON format
window.$devLogger.exportLogs('csv'); // CSV format
window.$devLogger.exportLogs('txt'); // Text format
```

## Keyboard Shortcuts

Default keyboard shortcuts (customizable in config):

| Shortcut | Action |
|----------|---------|
| `ctrl+shift+d` | Toggle console visibility |
| `ctrl+l` | Clear console |
| `ctrl+f` | Focus search bar |
| `esc` | Close console |

## Best Practices

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

## Error Handling

The Dev Console automatically captures and displays:
- Nuxt application errors
- Vue component errors
- JavaScript runtime errors
- Network request errors
- Console warnings and errors

## Theme Customization

```ts
devConsole: {
  theme: 'dark',
  customTheme: {
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      // Add custom color variables
    },
    light: {
      background: '#ffffff',
      text: '#000000',
      // Add custom color variables
    }
  }
}
```

## Storage and Persistence

The Dev Console implements intelligent storage management:
- Automatic persistence of logs to localStorage
- Smart quota management to prevent storage overflow
- Configurable maximum log history
- Automatic pruning of old logs when quota is exceeded
- Preservation of search history and filter settings

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/optocode/nuxt-dev-console/blob/main/CONTRIBUTING.md) for details.

## License

[MIT License](https://github.com/optocode/nuxt-dev-console/blob/main/LICENSE) 