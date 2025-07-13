/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New sophisticated color palette
        'eternity': {
          50: '#f8f7f6',
          100: '#f0edea',
          200: '#e1d9d3',
          300: '#c9bdb3',
          400: '#a99a8a',
          500: '#8d7a6a',
          600: '#7a6a5c',
          700: '#65574c',
          800: '#544741',
          900: '#22180e', // --eternity
        },
        'tabasco': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#aa2417', // --tabasco
        },
        'alpine': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#bf9835', // --alpine
        },
        'white-rock': {
          50: '#fefefe',
          100: '#fdfcfb',
          200: '#faf8f5',
          300: '#f5f2ed',
          400: '#edeadd', // --white-rock
          500: '#e5e0d1',
          600: '#d4cdbc',
          700: '#b8afa0',
          800: '#9a9184',
          900: '#7d756a',
        },
        'rob-roy': {
          50: '#fefdf7',
          100: '#fdfbe8',
          200: '#faf5c3',
          300: '#f6ed8a',
          400: '#f0e047',
          500: '#e9d17f', // --rob-roy
          600: '#d4b85c',
          700: '#b89a3d',
          800: '#947a32',
          900: '#78612a',
        },
        'pale-oyster': {
          50: '#faf9f8',
          100: '#f5f3f2',
          200: '#ebe7e5',
          300: '#d6cfcb',
          400: '#b8ada7',
          500: '#9c887e', // --pale-oyster
          600: '#8a7a71',
          700: '#73655d',
          800: '#5f544d',
          900: '#4e4540',
        },
        'cream-can': {
          50: '#fefdf0',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#f4d661', // --cream-can
          600: '#eab308',
          700: '#ca8a04',
          800: '#a16207',
          900: '#854d0e',
        },
        'sidecar': {
          50: '#fefef7',
          100: '#fdfbe8',
          200: '#faf5c3',
          300: '#f6ed8a',
          400: '#f2e5ac', // --sidecar
          500: '#e9d17f',
          600: '#d4b85c',
          700: '#b89a3d',
          800: '#947a32',
          900: '#78612a',
        },
        'silk': {
          50: '#faf9f8',
          100: '#f5f3f2',
          200: '#ebe7e5',
          300: '#d6cfcb',
          400: '#c0b4ad', // --silk
          500: '#a99a8a',
          600: '#8d7a6a',
          700: '#73655d',
          800: '#5f544d',
          900: '#4e4540',
        },
        'delta': {
          50: '#f8f8f7',
          100: '#f0f0ef',
          200: '#e5e5e3',
          300: '#d1d1ce',
          400: '#b8b8b4',
          500: '#a4a49c', // --delta
          600: '#8a8a82',
          700: '#6f6f68',
          800: '#5a5a54',
          900: '#4a4a45',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'pastry-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f8bbd9\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 