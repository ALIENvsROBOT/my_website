const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
        mono: ['JetBrains Mono', ...fontFamily.mono],
      },
      colors: {
        darkBg: '#030712',
        darkBgLight: '#111827',
        primary: '#6366F1',  // Indigo-500
        secondary: '#6D28D9', // Changed from #8B5CF6 (Violet-500) to #6D28D9 (Violet-700) for better contrast
        tertiary: '#4F46E5',  // Indigo-600
        highlight: '#5B21B6', // Changed from #7C3AED (Violet-600) to #5B21B6 (Violet-800) for better contrast
        lightText: '#F3F4F6', // Gray-100
        darkText: '#1F2937',  // Gray-800
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-circuit': "url('/images/circuit-pattern.svg')",
      },
      boxShadow: {
        'neon': '0 0 5px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.2)',
        'neon-lg': '0 0 10px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.2)',
        'glow': '0 0 40px rgba(124, 58, 237, 0.5)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scroll-x': 'scroll-x 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
} 