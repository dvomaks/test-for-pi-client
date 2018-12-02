require('dotenv').config()

module.exports = {
  env: {
    apiUrl: process.env.API_URL || 'http://localhost:8000',
    appName: process.env.APP_NAME || 'Client',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    appLocale: process.env.APP_LOCALE || 'en'
  },

  head: {
    title: 'postindustria-client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js + Vuetify.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/axios'
  ],

  modules: [
    '@nuxtjs/toast',
  ],

  toast: {
    position: 'top-right',
    duration: 5000
  },

  css: ['~/assets/style/app.styl'],

  loading: { color: '#8dd9ff' },

  build: {
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
