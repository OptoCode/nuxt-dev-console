# Theme Customization

Learn how to customize the appearance of the Nuxt Dev Console to match your application's design system.

## Basic Theme Configuration

The Dev Console supports three theme modes:

```ts
export default defineNuxtConfig({
  devConsole: {
    theme: 'system' // 'dark' | 'light' | 'system'
  }
})
```

## Custom Theme Colors

### Color Palette Structure

```ts
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

### Full Theme Configuration

```ts
export default defineNuxtConfig({
  devConsole: {
    customTheme: {
      dark: {
        // Main colors
        background: '#1a1a1a',
        text: '#ffffff',
        
        // Status colors
        success: '#4caf50',
        info: '#2196f3',
        warning: '#ff9800',
        error: '#f44336',
        muted: '#9e9e9e',
        
        // Optional colors
        border: '#333333',
        accent: '#7c4dff',
        highlight: '#424242'
      },
      light: {
        // Main colors
        background: '#ffffff',
        text: '#000000',
        
        // Status colors
        success: '#43a047',
        info: '#1e88e5',
        warning: '#fb8c00',
        error: '#e53935',
        muted: '#757575',
        
        // Optional colors
        border: '#e0e0e0',
        accent: '#651fff',
        highlight: '#f5f5f5'
      }
    }
  }
})
```

## Component-Specific Theming

### Console Header

```ts
export default defineNuxtConfig({
  devConsole: {
    customTheme: {
      dark: {
        header: {
          background: '#2d2d2d',
          text: '#ffffff',
          border: '#404040'
        }
      },
      light: {
        header: {
          background: '#f5f5f5',
          text: '#000000',
          border: '#e0e0e0'
        }
      }
    }
  }
})
```

### Log Entry Styling

```ts
export default defineNuxtConfig({
  devConsole: {
    customTheme: {
      dark: {
        logEntry: {
          background: '#1a1a1a',
          alternateBackground: '#242424',
          hover: '#333333',
          selected: '#404040',
          timestamp: '#9e9e9e',
          border: '#333333'
        }
      },
      light: {
        logEntry: {
          background: '#ffffff',
          alternateBackground: '#f8f8f8',
          hover: '#f0f0f0',
          selected: '#e3f2fd',
          timestamp: '#757575',
          border: '#e0e0e0'
        }
      }
    }
  }
})
```

### Search and Filter Bar

```ts
export default defineNuxtConfig({
  devConsole: {
    customTheme: {
      dark: {
        search: {
          background: '#2d2d2d',
          text: '#ffffff',
          placeholder: '#9e9e9e',
          border: '#404040',
          icon: '#757575'
        }
      },
      light: {
        search: {
          background: '#f5f5f5',
          text: '#000000',
          placeholder: '#757575',
          border: '#e0e0e0',
          icon: '#9e9e9e'
        }
      }
    }
  }
})
```

## CSS Variables

The Dev Console exposes CSS variables that you can override in your application:

```css
:root {
  --nuxt-dev-console-bg: #ffffff;
  --nuxt-dev-console-text: #000000;
  --nuxt-dev-console-success: #43a047;
  --nuxt-dev-console-info: #1e88e5;
  --nuxt-dev-console-warning: #fb8c00;
  --nuxt-dev-console-error: #e53935;
  --nuxt-dev-console-muted: #757575;
  --nuxt-dev-console-border: #e0e0e0;
  --nuxt-dev-console-accent: #651fff;
  --nuxt-dev-console-highlight: #f5f5f5;
}

/* Dark mode variables */
@media (prefers-color-scheme: dark) {
  :root {
    --nuxt-dev-console-bg: #1a1a1a;
    --nuxt-dev-console-text: #ffffff;
    /* ... other dark mode variables ... */
  }
}
```

## Dynamic Themes

### Runtime Theme Switching

```ts
// In your component or plugin
const devConsole = useNuxtDevConsole()

// Switch theme
devConsole.setTheme('dark')

// Update theme colors
devConsole.updateTheme({
  dark: {
    background: '#000000',
    text: '#ffffff'
  }
})
```

### Theme Presets

```ts
export default defineNuxtConfig({
  devConsole: {
    themes: {
      // GitHub-like theme
      github: {
        dark: {
          background: '#0d1117',
          text: '#c9d1d9',
          // ... other colors
        },
        light: {
          background: '#ffffff',
          text: '#24292f',
          // ... other colors
        }
      },
      // VS Code-like theme
      vscode: {
        dark: {
          background: '#1e1e1e',
          text: '#d4d4d4',
          // ... other colors
        },
        light: {
          background: '#ffffff',
          text: '#000000',
          // ... other colors
        }
      }
    }
  }
})
```

## Best Practices

1. **Color Contrast**
   - Ensure sufficient contrast between background and text colors
   - Test your theme with accessibility tools
   - Follow WCAG 2.1 guidelines for color contrast

2. **Consistent Styling**
   - Maintain consistent color usage across different states
   - Use similar shades for related components
   - Keep the visual hierarchy clear

3. **Theme Switching**
   - Test both light and dark themes thoroughly
   - Ensure smooth transitions between themes
   - Validate all component states in both themes

4. **Performance**
   - Use CSS variables for dynamic theme changes
   - Minimize runtime theme modifications
   - Cache theme preferences locally

## Related

- [Configuration Guide](/features/configuration)
- [TypeScript Support](/advanced/typescript-support)
- [Best Practices](/advanced/best-practices) 