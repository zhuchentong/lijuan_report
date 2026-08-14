import { defineConfig, presetWind3, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3({ important: '#app' }),
    presetAttributify(),
  ],
  theme: {
    colors: {
      primary: 'var(--c-primary)',
      secondary: 'var(--c-secondary)',
      accent: 'var(--c-accent)',
      'bg-light': 'var(--c-bg-light)',
      'bg-lighter': 'var(--c-bg-lighter)',
      'text-dark': 'var(--c-text-dark)',
      'text-mid': 'var(--c-text-mid)',
      'text-light': 'var(--c-text-light)',
      gold: 'var(--c-gold)',
      'gold-light': 'var(--c-gold-light)',
      border: 'var(--c-border)',
      green: 'var(--c-green)',
      'green-light': 'var(--c-green-light)',
      red: 'var(--c-red)',
      'red-light': 'var(--c-red-light)',
    },
    fontFamily: {
      cn: 'var(--font-cn)',
      en: 'var(--font-en)',
    },
  },
})
