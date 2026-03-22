/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        arabic:  ['IBMPlexArabic', 'IBM Plex Sans Arabic', 'sans-serif'],
        latin:   ['IBM Plex Sans', 'sans-serif'],
        display: ['Instrument Serif', 'serif'],
      },
      colors: {
        primary:  { DEFAULT: '#2B9225', hover: '#1F6E1A', light: '#E8F5E7' },
        accent:   { DEFAULT: '#C47A3C', hover: '#9E5F28', light: '#FDF0E4' },
        success:  { DEFAULT: '#1DB87B', bg: '#E8FBF3' },
        danger:   { DEFAULT: '#E8384D', bg: '#FDECED' },
        warning:  { DEFAULT: '#F5A623', bg: '#FEF6E4' },
        info:     { DEFAULT: '#4A90E2', bg: '#EBF4FF' },
        sidebar:  '#132E11',
        page:     '#F4F6F3',
        surface:  '#FFFFFF',
        'surface-2': '#F4F6F3',
      },
      boxShadow: {
        green:   '0 0 24px rgba(43,146,37,0.18)',
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
