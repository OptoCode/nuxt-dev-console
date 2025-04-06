# Best Practices

Learn how to effectively use the Nuxt Dev Console in your application while following best practices for performance, security, and maintainability.

## Performance Optimization

### Log Management

1. **Queue Configuration**
   ```ts
   export default defineNuxtConfig({
     devConsole: {
       logger: {
         queueSize: 1000,        // Limit queue size based on needs
         flushInterval: 100,     // Adjust based on log volume
         dropOldest: true        // Prevent memory issues
       }
     }
   })
   ```

2. **Virtual Scrolling**
   ```ts
   export default defineNuxtConfig({
     devConsole: {
       performance: {
         virtualScrolling: true,
         maxRenderItems: 100,    // Adjust based on UI needs
         debounceTime: 16        // One frame at 60fps
       }
     }
   })
   ```

3. **Log Level Management**
   ```ts
   // Production configuration
   export default defineNuxtConfig({
     devConsole: {
       logger: {
         level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
         levels: {
           debug: process.env.NODE_ENV !== 'production',
           log: process.env.NODE_ENV !== 'production',
           info: true,
           warn: true,
           error: true
         }
       }
     }
   })
   ```

## Security Considerations

### Production Usage

1. **Disable in Production**
   ```ts
   export default defineNuxtConfig({
     devConsole: {
       enabled: process.env.NODE_ENV !== 'production',
       allowProduction: false
     }
   })
   ```

2. **Sensitive Data Protection**
   ```ts
   // Custom log formatter
   const devConsole = useNuxtDevConsole()
   
   const logSafeData = (data: any) => {
     // Remove sensitive fields
     const sanitized = { ...data }
     delete sanitized.password
     delete sanitized.token
     delete sanitized.secret
     return sanitized
   }
   
   devConsole.log('User data:', logSafeData(userData))
   ```

3. **Network Request Filtering**
   ```ts
   export default defineNuxtConfig({
     devConsole: {
       network: {
         excludePatterns: [
           '/api/auth',          // Exclude auth endpoints
           '/api/sensitive',     // Exclude sensitive data
           '*.password',         // Exclude password fields
           '*.token'            // Exclude tokens
         ]
       }
     }
   })
   ```

## Code Organization

### Structured Logging

1. **Group Related Logs**
   ```ts
   const devConsole = useNuxtDevConsole()
   
   // Group related operations
   devConsole.group('User Authentication')
   try {
     devConsole.info('Validating credentials...')
     await validateCredentials()
     devConsole.info('Generating token...')
     await generateToken()
     devConsole.success('Authentication successful')
   } catch (error) {
     devConsole.error('Authentication failed:', error)
   } finally {
     devConsole.groupEnd()
   }
   ```

2. **Custom Log Categories**
   ```ts
   // logger.ts
   export const createLogger = (category: string) => {
     const devConsole = useNuxtDevConsole()
     return {
       log: (...args: any[]) => devConsole.log(`[${category}]`, ...args),
       info: (...args: any[]) => devConsole.info(`[${category}]`, ...args),
       warn: (...args: any[]) => devConsole.warn(`[${category}]`, ...args),
       error: (...args: any[]) => devConsole.error(`[${category}]`, ...args)
     }
   }
   
   // Usage
   const authLogger = createLogger('Auth')
   const apiLogger = createLogger('API')
   ```

3. **Performance Tracking**
   ```ts
   const devConsole = useNuxtDevConsole()
   
   // Track operation timing
   const trackOperation = async (name: string, operation: () => Promise<any>) => {
     devConsole.time(name)
     try {
       const result = await operation()
       devConsole.timeEnd(name)
       return result
     } catch (error) {
       devConsole.timeEnd(name)
       throw error
     }
   }
   ```

## Error Handling

### Structured Error Logging

1. **Custom Error Classes**
   ```ts
   class AppError extends Error {
     constructor(
       message: string,
       public code: string,
       public details?: any
     ) {
       super(message)
       this.name = 'AppError'
     }
   }
   
   const devConsole = useNuxtDevConsole()
   
   try {
     throw new AppError('Failed to load', 'LOAD_ERROR', { id: 123 })
   } catch (error) {
     if (error instanceof AppError) {
       devConsole.error(`${error.code}: ${error.message}`, error.details)
     } else {
       devConsole.error('Unknown error:', error)
     }
   }
   ```

2. **Error Boundaries**
   ```ts
   // error-boundary.vue
   export default defineComponent({
     setup() {
       const devConsole = useNuxtDevConsole()
       
       onErrorCaptured((error, instance, info) => {
         devConsole.error('Component Error:', {
           error,
           component: instance?.$options.name,
           info
         })
         return false // Prevent error propagation
       })
     }
   })
   ```

## Testing and Debugging

### Debug Helpers

1. **Conditional Debugging**
   ```ts
   const DEBUG = process.env.NODE_ENV !== 'production'
   const debugLog = DEBUG ? useNuxtDevConsole() : console
   
   // Usage
   debugLog.log('Debug info:', data)
   ```

2. **Test Environment**
   ```ts
   // test/setup.ts
   import { useNuxtDevConsole } from '@opto-code/nuxt-dev-console'
   
   // Mock console for testing
   const mockConsole = {
     logs: [] as any[],
     log: (...args: any[]) => mockConsole.logs.push({ type: 'log', args }),
     error: (...args: any[]) => mockConsole.logs.push({ type: 'error', args })
     // ... other methods
   }
   
   vi.mock('@opto-code/nuxt-dev-console', () => ({
     useNuxtDevConsole: () => mockConsole
   }))
   ```

## Maintenance

### Regular Cleanup

1. **Auto-clear Old Logs**
   ```ts
   export default defineNuxtConfig({
     devConsole: {
       storage: {
         enabled: true,
         maxSize: 5 * 1024 * 1024, // 5MB
         ttl: 24 * 60 * 60        // 24 hours
       }
     }
   })
   ```

2. **Session Management**
   ```ts
   // On application start
   const devConsole = useNuxtDevConsole()
   
   onMounted(() => {
     // Clear previous session logs
     devConsole.clear()
     devConsole.info('New session started:', {
       timestamp: new Date(),
       version: process.env.APP_VERSION
     })
   })
   ```

## Related

- [Configuration Guide](/features/configuration)
- [TypeScript Support](/advanced/typescript-support)
- [Theme Customization](/advanced/theme-customization) 