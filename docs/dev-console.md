# Dev Console Component

The Nuxt Dev Console module provides a powerful development console component that helps you debug and monitor your Nuxt application in real-time.

## Features

- Interactive console interface with customizable position and size
- Local storage persistence for logs with quota management
- Tag support for better log organization and filtering
- Export functionality in multiple formats (JSON, CSV, TXT)
- Customizable themes (dark, light, system)
- Keyboard shortcuts for common operations
- Real-time log filtering and search
- Collapsible log groups

## Configuration

Configure the Dev Console component in your `nuxt.config.js`:

```js
// nuxt.config.js
export default defineNuxtConfig({
  devConsole: {
    // Visual Configuration
    position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    theme: 'dark', // 'dark', 'light', 'system'
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
      minLevel: 'info' // 'debug', 'info', 'warn', 'error'
    }
  }
})
```

## Log Storage and Persistence

The Dev Console automatically manages log persistence:

- Logs are automatically saved to localStorage
- Intelligent quota management:
  - Automatic pruning of old logs when quota is exceeded
  - Configurable maximum log history
- Session persistence:
  - Logs are restored between page reloads
  - Search history is preserved
  - Filter settings are maintained

## Log Organization

### Tags and Filtering

Use tags to organize and filter your logs:

```js
// In your components
$devLogger.logWithTags(['auth', 'user'], 'User authenticated');
$devLogger.errorWithTags(['api'], 'API request failed');

// Filter logs in the console UI
// - Click on tags to filter
// - Use the search bar for text search
// - Combine multiple tags for advanced filtering
```

### Log Groups

Organize related logs into collapsible groups:

```js
$devLogger.group('API Requests');
$devLogger.log('GET /api/users');
$devLogger.log('POST /api/data');
$devLogger.groupEnd();
```

## Export Functionality

Export your logs in multiple formats:

```js
// Programmatic export
window.$devLogger.exportLogs(); // JSON format
window.$devLogger.exportLogs('csv'); // CSV format
window.$devLogger.exportLogs('txt'); // Text format

// UI Export
// - Click the export button in the console
// - Select your desired format
// - Choose export options (time range, log levels, tags)
```

## Keyboard Shortcuts

Default keyboard shortcuts (customizable):

- `ctrl+shift+d`: Toggle console visibility
- `ctrl+l`: Clear console
- `ctrl+f`: Focus search bar
- `esc`: Close console

Configure shortcuts in your `nuxt.config.js`:

```js
shortcuts: {
  toggle: 'ctrl+shift+d',
  clear: 'ctrl+l',
  search: 'ctrl+f'
}
```

## Best Practices

1. Position the console where it won't interfere with your UI testing
2. Use tags consistently across your application for better organization
3. Export logs when debugging complex issues
4. Use keyboard shortcuts for faster workflow
5. Configure appropriate log levels for different environments
6. Use log groups for related operations
7. Regularly clear old logs to maintain performance

## Theming

The Dev Console supports three theme modes:

- `dark`: Dark theme for low-light environments
- `light`: Light theme for high-contrast
- `system`: Automatically matches system preferences

Custom theme configuration:

```js
devConsole: {
  theme: 'dark',
  customTheme: {
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      // ... other color variables
    },
    light: {
      background: '#ffffff',
      text: '#000000',
      // ... other color variables
    }
  }
}
``` 