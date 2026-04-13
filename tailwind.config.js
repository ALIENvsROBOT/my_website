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
        darkBg: '#F4F4F2',
        darkBgLight: '#FFFFFF',
        primary: '#6B7280',
        secondary: '#2F2F31',
        tertiary: '#7A7A7A',
        highlight: '#111111',
        lightText: '#202022',
        darkText: '#0F0F10',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-circuit': "url('/images/circuit-pattern.svg')",
      },
      boxShadow: {
        'neon': '0 0 5px rgba(39, 39, 42, 0.1), 0 0 20px rgba(39, 39, 42, 0.08)',
        'neon-lg': '0 0 10px rgba(39, 39, 42, 0.14), 0 0 30px rgba(39, 39, 42, 0.1)',
        'glow': '0 0 40px rgba(39, 39, 42, 0.18)',
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
