import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Nuxt Dev Console",
  description: "A powerful development console for Nuxt 3 applications",
  base: '/nuxt-dev-console/',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'GitHub', link: 'https://github.com/OptoCode/nuxt-dev-console' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Quick Start', link: '/guide/quick-start' }
        ]
      },
      {
        text: 'Features',
        items: [
          { text: 'Dev Console', link: '/features/dev-console' },
          { text: 'Dev Logger', link: '/features/dev-logger' },
          { text: 'Configuration', link: '/features/configuration' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Theme Customization', link: '/advanced/theme-customization' },
          { text: 'TypeScript Support', link: '/advanced/typescript-support' },
          { text: 'Best Practices', link: '/advanced/best-practices' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/OptoCode/nuxt-dev-console' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 OptoCode'
    }
  }
}) 