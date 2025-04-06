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

Use tags to organize and filter your logs. First, get a reference to the DevConsole component:

```vue
<template>
  <DevConsole ref="devConsole" />
</template>

<script setup>
import { ref } from 'vue'
const devConsole = ref(null)
</script>
```

Then use the tag-enabled logging methods:

```js
// Basic tagged logging
devConsole.value.logWithTags(['user', 'auth'], 'User logged in', { userId: 123 });
devConsole.value.errorWithTags(['api', 'error'], 'API request failed', new Error('Network error'));
devConsole.value.warnWithTags(['performance'], 'Slow operation detected', { latency: '500ms' });
devConsole.value.infoWithTags(['config'], 'Config loaded', { environment: 'production' });

// Multiple tags for better categorization
devConsole.value.logWithTags(
  ['auth', 'security', 'user'],
  'Two-factor authentication enabled',
  { method: 'SMS', userId: 123 }
);

// Tags for feature tracking
devConsole.value.logWithTags(
  ['feature-x', 'beta'],
  'New feature accessed',
  { featureId: 'x-123', usage: 'first-time' }
);

// Tags for error tracking
devConsole.value.errorWithTags(
  ['database', 'query', 'error'],
  'Database query failed',
  { query: 'SELECT...', error: 'Timeout' }
);

// Tags for performance monitoring
devConsole.value.warnWithTags(
  ['performance', 'api', 'latency'],
  'API response time exceeded threshold',
  { endpoint: '/api/users', duration: '2500ms', threshold: '2000ms' }
);
```

Each logging method supports:
- An array of tags as the first argument
- A message string as the second argument
- Additional data as subsequent arguments (objects, errors, etc.)

In the Dev Console UI, you can:
- Click on tags to filter logs
- Combine multiple tags to see logs matching all selected tags
- Use the search bar along with tags for advanced filtering
- Clear tag filters by clicking the clear button

Common tag categories:
- Feature areas: 'auth', 'api', 'database', 'ui'
- Log types: 'error', 'warning', 'debug'
- Environment: 'dev', 'staging', 'prod'
- Components: 'frontend', 'backend', 'middleware'
- Status: 'success', 'failure', 'pending'

Best practices:
1. Use consistent tag naming across your application
2. Combine broad and specific tags for better filtering
3. Include relevant data objects with your tagged logs
4. Use tags to track feature usage and errors
5. Group related operations with similar tags

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