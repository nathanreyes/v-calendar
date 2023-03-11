/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

delete colors.lightBlue;

module.exports = {
  content: ['./docs/.vitepress/**/*.{js,ts,vue}', './docs/**/*.md'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Lexend', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        accent: colors.indigo,
      },
    },
  },
  plugins: [require('@tailwindcss/typography', '@tailwindcss/forms')],
};
