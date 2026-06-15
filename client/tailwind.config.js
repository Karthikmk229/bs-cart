/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Pongal leaf green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        saffron: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Deep turmeric gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        medical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Clinical blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        primary: '#006c49',
        secondary: '#0058be',
        tertiary: '#855300',
        background: '#f8f9ff',
        'primary-container': '#10b981',
        'secondary-container': '#2170e4',
        'tertiary-container': '#e29100',
        'primary-fixed-dim': '#4edea3',
        'surface-container-low': '#eff4ff',
        'surface-container-high': '#dee9fc',
        'surface-container-highest': '#d9e3f6',
        'surface-container-lowest': '#ffffff',
        'on-surface-variant': '#3c4a42'
      },
      spacing: {
        'grid-margin': '20px',
        'grid-gutter': '16px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
