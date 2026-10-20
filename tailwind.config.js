/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0b',
          surface: '#111114',
          elevated: '#17171d',
          border: 'rgba(242, 239, 233, 0.08)',
        },
        gold: {
          DEFAULT: '#d4a853',
          light: '#e6c57d',
          dark: '#b88d3b',
          glow: 'rgba(212, 168, 83, 0.25)',
        },
        cream: {
          DEFAULT: '#f2efe9',
          muted: '#8b8780',
          subtle: '#5c5853',
        },
        light: {
          bg: '#f4f1ea',
          surface: '#e8e4dc',
          text: '#0a0a0b',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest_luxury: '0.25em',
        ultra: '0.35em',
      },
      boxShadow: {
        'gold-glow': '0 0 35px -5px rgba(212, 168, 83, 0.2)',
        'gold-glow-lg': '0 0 60px -10px rgba(212, 168, 83, 0.35)',
        'dark-sheet': '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 168, 83, 0.08)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
