import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2e9b47',
          700: '#21813a',
        },
      },
      boxShadow: {
        soft: '0 20px 40px rgba(2,6,23,0.2)',
      },
      borderRadius: {
        pill: '999px',
      }
    },
  },
  plugins: [],
}

export default config