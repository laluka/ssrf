/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        twitch: {
          purple: '#9146FF',
        },
        cuistops: {
          brown: '#D4A574',
          red: '#C0392B',
          gold: '#F39C12',
        },
      },
    },
  },
  plugins: [],
};
