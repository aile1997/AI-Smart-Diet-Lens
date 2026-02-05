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
      cdn: 'https://esm.sh/',
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
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
    },
    boxShadow: {
      'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      'fab': '0 4px 14px 0 rgb(56 224 123 / 0.4)',
      'glow': '0 0 20px rgba(56, 224, 123, 0.5)',
      'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg text-white bg-primary active:opacity-80',
    'card': 'p-4 bg-white rounded-xl shadow-sm',
    'page-container': 'min-h-screen bg-gray-50 pb-safe',
    'app-container': 'max-w-md mx-auto w-full',
  },
})
