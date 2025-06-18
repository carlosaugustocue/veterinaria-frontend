import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// 🎨 Tema estilo Tailwind
const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    primary: '#3B82F6',
    'primary-darken-1': '#1D4ED8',
    secondary: '#6B7280',
    'secondary-darken-1': '#374151',
    error: '#EF4444',
    info: '#0EA5E9',
    success: '#10B981',
    warning: '#F59E0B',
  },
  variables: {
    'border-radius-root': '0.5rem',
    'font-size-root': '16px',
    'font-family': 'Inter, sans-serif',
  },
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
  defaults: {
    VCard: {
      flat: true,
      border: true,
    },
    VBtn: {
      color: 'primary',
      style: 'text-transform: none;',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})
