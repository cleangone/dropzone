// Configuration for your app

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'firebase'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons',
      'mdi-v3',
      'fontawesome-v5'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        'QBtn',
        'QDate',
        'QDrawer',
        'QIcon',
        'QList',
        'QBanner',
        'QCard', 'QCardActions', 'QCardSection',
        'QCheckbox',
        'QDialog',
        'QEditor',
        'QExpansionItem',
        'QField',
        'QFooter',
        'QForm',
        'QHeader',
        'QImg',
        'QInput',
        'QItem', 'QItemLabel', 'QItemSection',
        'QLayout',
        'QMenu',
        'QPage', 'QPageContainer',
        'QParallax',
        'QPopupProxy',
        'QRadio',
        'QRating',
        'QRouteTab',
        'QScrollArea',
        'QSeparator',
        'QSelect',
        'QSlideTransition',
        'QSpace',
        'QSpinner',
        'QTab', 'QTabPanel','QTabPanels', 'QTabs',
        'QTable', 'QTh', 'QTr', 'QTd',
        'QTime',
        'QToggle',
        'QToolbar', 'QToolbarTitle',
        'QTooltip'
      ],

      directives: [
        'Ripple',
        'ClosePopup'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog'
      ]

      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
