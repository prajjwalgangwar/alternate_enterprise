import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'premium-dark': '#0A3A22',
        'premium-gold': '#C79A3B',
        'premium-light': '#F8F8F5',
        'tobacco': {
          50: '#f0f7f2',
          100: '#e0efe4',
          200: '#b8d9c4',
          300: '#8cc3a2',
          400: '#5ca87c',
          500: '#3d8f5e',
          600: '#166534',
          700: '#0F4D2E',
          800: '#0A3A22',
          900: '#062616',
          950: '#031408',
        },
        'cream': '#F8F8F5',
        'charcoal': '#1B1B1B',
        'primary': {
          DEFAULT: '#0F4D2E',
          dark: '#0A3A22',
          light: '#166534',
        },
        'gold': {
          DEFAULT: '#C79A3B',
        },
      },
      fontFamily: {
        'sans': ['Geist', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'tobacco-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C79A3B' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
