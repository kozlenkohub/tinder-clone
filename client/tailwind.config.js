/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'heart-move': 'heartMove 4s ease-in-out infinite',
        'heart-pulse': 'heartPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        heartMove: {
          '0%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: '0',
          },
        },
        heartPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '0.7',
          },
        },
      },
    },
  },
  plugins: [],
};
