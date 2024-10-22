export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxthub/core',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    'nuxt-echarts',
  ],
  hub: {
    database: true
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },
  devtools: {
    enabled: true
  },
  nitro: {
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      // Run `cms:update` task every minute
      '*/5 * * * *': ['获取充电站状态']
    }
  },
  echarts: {
    // Options
    renderer: ['canvas', 'svg'],
    charts: ['CustomChart'],
    components: [
      'PolarComponent',
      'DatasetComponent',
      'GridComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'LegendComponent',
      'VisualMapComponent'
    ],
  }
})
