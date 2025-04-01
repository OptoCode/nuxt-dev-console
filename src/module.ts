import { defineNuxtModule, addComponent, createResolver, addImportsDir } from '@nuxt/kit'

export interface ModuleOptions {
  enabled?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-dev-console',
    configKey: 'devConsole',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    enabled: true
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    const resolver = createResolver(import.meta.url)

    // Add DevConsole component
    addComponent({
      name: 'DevConsole',
      filePath: resolver.resolve('./runtime/components/DevConsole.vue'),
      global: true
    })

    // Add composables
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Add plugin to inject DevConsole into app
    nuxt.hook('app:templates', () => {
      addComponent({
        name: 'NuxtDevConsole',
        filePath: resolver.resolve('./runtime/components/DevConsole.vue'),
        global: true
      })
    })
  }
})