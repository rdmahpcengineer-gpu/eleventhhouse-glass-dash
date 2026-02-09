/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./ehcx.ai-metrics-dashboard-metrivcs 2/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // EHCX.ai Design System
        'primary-dark': '#0A0F19',
        'palladian': '#EEE9DF',
        'abyssal': '#0F172A',
        'accent-blue': '#3B82F6',
        'accent-orange': '#FFB162',
        // Legacy support
        primary: '#000000',
        accent: {
          orange: '#FFB162',
          blue: '#3B82F6',
        },
        surface: '#f8f9fa',
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'status-pulse': 'status-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'status-pulse': {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 6px rgba(34, 197, 94, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
      },
    },
  },
  plugins: [],
}
