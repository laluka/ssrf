/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        twitch: {
          purple: '#9146FF'
        },
      },
    },
  },
  plugins: [],
};