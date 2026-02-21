/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          200: '#aecbfa',
          300: '#8ab4f8',
          400: '#669df6',
          500: '#1a73e8',
          600: '#1557b0',
          700: '#104a8e',
          800: '#0b3d7a',
          900: '#062e6f',
        },
        success: {
          50: '#e6f4ea',
          100: '#ceead6',
          400: '#5bb974',
          500: '#0d904f',
          600: '#0a7a42',
        },
        warning: {
          50: '#fef7e0',
          100: '#feefc3',
          400: '#fdd663',
          500: '#e37400',
          600: '#c26200',
        },
        danger: {
          50: '#fce8e6',
          100: '#fadbd8',
          400: '#ee675c',
          500: '#d93025',
          600: '#b3261e',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
      },
      maxWidth: {
        mobile: '430px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        pulse: 'pulse 2s ease-in-out infinite',
        ring: 'ring 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%': { transform: 'rotate(14deg)' },
          '20%, 40%': { transform: 'rotate(-14deg)' },
          '50%': { transform: 'rotate(0deg)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        slideDown: {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
