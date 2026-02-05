import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      sage: {
        50: '#f6f7f6',
        100: '#e3e5e3',
        200: '#c7ccc7',
        300: '#a4ada4',
        400: '#808d80',
        500: '#38e07b',
        600: '#2cb863',
        700: '#1f8a4a',
        800: '#196e3b',
        900: '#155a31',
      },
      primary: '#38e07b',
    },
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg text-white bg-primary active:opacity-80',
    'card': 'p-4 bg-white rounded-xl shadow-sm',
    'page-container': 'min-h-screen bg-gray-50 pb-safe',
  },
})
