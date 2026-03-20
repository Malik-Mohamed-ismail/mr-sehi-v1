/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        arabic:  ['IBMPlexArabic', 'sans-serif'],
        latin:   ['IBM Plex Sans', 'sans-serif'],
        display: ['Instrument Serif', 'serif'],
      },
      colors: {
        primary:  { DEFAULT: '#D4A853', hover: '#C4953F', light: '#FDF3DC' },
        success:  { DEFAULT: '#1DB87B', bg: '#E8FBF3' },
        danger:   { DEFAULT: '#E8384D', bg: '#FDECED' },
        warning:  { DEFAULT: '#F5A623', bg: '#FEF6E4' },
        info:     { DEFAULT: '#4A90E2', bg: '#EBF4FF' },
        sidebar:  '#0D0F1A',
        surface:  '#FFFFFF',
        'surface-2': '#F0EFE9',
      },
      boxShadow: {
        gold:    '0 0 30px rgba(212,168,83,0.25)',
        'gold-lg':'0 0 40px rgba(212,168,83,0.35)',
        success: '0 0 20px rgba(29,184,123,0.20)',
        danger:  '0 0 20px rgba(232,56,77,0.20)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'count-up': 'countUp 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
