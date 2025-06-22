// nuxt.config.ts
export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  ssr: false,
  modules: [
    '@pinia/nuxt',
    'nuxt-toast',
  ],
  build: {
    transpile: ['primevue'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      authBase: process.env.NUXT_PUBLIC_AUTH_BASE,
      storageBase: process.env.NUXT_PUBLIC_STORAGE_BASE,
    }
  },
  imports: {
    dirs: ['utils']
  },
  plugins: [
    '~/plugins/jquery.client.ts',
    '~/plugins/api.client.ts',
    '~/plugins/primevue.ts',
  ],
  css: [
    '~/public/vendor/libs/select2/select2.css',
  ],
  app: {
    baseURL: '/',
    head: {
      title: 'Kainnova Digital Solutions',
      htmlAttrs: {
        lang: 'en',
        dir: 'ltr',
        'data-assets-path': ''
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' },
        { name: 'description', content: '' }
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/x-xicon', href: '/img/favicon/favicon.ico' },

        // Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' },

        // Icons
        { rel: 'stylesheet', href: '/vendor/fonts/remixicon/remixicon.css' },
        { rel: 'stylesheet', href: '/vendor/fonts/flag-icons.css' },

        // Menu waves
        { rel: 'stylesheet', href: '/vendor/libs/node-waves/node-waves.css' },

        // Core CSS
        { rel: 'stylesheet', href: '/vendor/css/rtl/core.css' },
        { rel: 'stylesheet', href: '/vendor/css/rtl/theme-default.css' },
        { rel: 'stylesheet', href: '/css/demo.css' },

        // Vendors CSS
        { rel: 'stylesheet', href: '/vendor/libs/perfect-scrollbar/perfect-scrollbar.css' },
        { rel: 'stylesheet', href: '/vendor/libs/typeahead-js/typeahead.css' },
        { rel: 'stylesheet', href: '/vendor/libs/datatables-bs5/datatables.bootstrap5.css' },
        { rel: 'stylesheet', href: '/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css' },
        { rel: 'stylesheet', href: '/vendor/libs/apex-charts/apex-charts.css' },
        { rel: 'stylesheet', href: '/vendor/libs/tagify/tagify.css' },
        { rel: 'stylesheet', href: '/vendor/libs/bootstrap-select/bootstrap-select.css' },
        { rel: 'stylesheet', href: '/vendor/libs/select2/select2.css' },
        { rel: 'stylesheet', href: '/vendor/libs/swiper/swiper.css' },
        // Page CSS
        { rel: 'stylesheet', href: '/vendor/css/pages/cards-statistics.css' },
        { rel: 'stylesheet', href: '/vendor/css/pages/cards-analytics.css' },
        { rel: 'stylesheet', href: '/vendor/css/pages/page-auth.css' },
      ],
      script: [
        // Helpers & Config (biasanya dimuat di head)
        { src: '/vendor/js/helpers.js', type: 'text/javascript' },
        { src: '/js/config.js', type: 'text/javascript' },

        // @ts-ignore
        { src: '/vendor/libs/jquery/jquery.js', body: true, type: 'text/javascript' },

        // @ts-ignore
        { src: '/vendor/libs/datatables-bs5/datatables-bootstrap5.js', body: true, type: 'text/javascript' },
        
        // @ts-ignore
        { src: '/vendor/libs/popper/popper.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/js/bootstrap.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/libs/node-waves/node-waves.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/libs/perfect-scrollbar/perfect-scrollbar.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/libs/hammer/hammer.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/libs/select2/select2.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/libs/bootstrap-select/bootstrap-select.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/libs/typeahead-js/typeahead.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/js/menu.js', body: true, type: 'text/javascript' },
        
        // @ts-ignore
        { src: '/vendor/libs/apex-charts/apexcharts.js', body: true, type: 'text/javascript' },
        // @ts-ignore
        { src: '/vendor/libs/swiper/swiper.js', body: true, type: 'text/javascript' },
        
        // @ts-ignore
        { src: '/js/main.js', body: true, type: 'text/javascript' },

        // @ts-ignore
        { src: '/js/dashboards-analytics.js', body: true, type: 'text/javascript' }
      ]
    }
  },

  compatibilityDate: "2025-02-01",
})