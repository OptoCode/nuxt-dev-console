# Getting Started

Welcome to the Nuxt Dev Console documentation! This guide will help you get started with integrating and using the development console in your Nuxt 3 applications.

## What is Nuxt Dev Console?

Nuxt Dev Console is a powerful development tool that provides:
- Real-time logging and debugging capabilities
- Advanced filtering and search functionality
- Tag-based log organization
- Customizable themes and positioning
- TypeScript support
- Zero production overhead

## Prerequisites

- Nuxt 3 project
- Node.js 16.x or later
- npm, yarn, or pnpm package manager

## Quick Start

1. Install the package:
```bash
npm install @opto-code/nuxt-dev-console
```

2. Add to your `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  modules: ['@opto-code/nuxt-dev-console'],
  devConsole: {
    enabled: true
  }
})
```

3. Start using in your components:
```vue
<template>
  <div>
    <DevConsole />
  </div>
</template>
```

## Next Steps

- Learn about [installation options](/guide/installation)
- Check out the [quick start guide](/guide/quick-start)
- Explore [features](/features/dev-console)
- Read about [configuration options](/features/configuration) 