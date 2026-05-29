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
        'premium-dark': '#0a0a0a',
        'premium-gold': '#d4af37',
        'premium-light': '#f5f5f5',
      },
      fontFamily: {
        'sans': ['Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
