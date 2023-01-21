/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

delete colors.lightBlue;

module.exports = {
  content: ['./docs/.vitepress/components/**/*.{js,ts,vue}', './docs/**/*.md'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: colors.indigo,
      },
    },
  },
  plugins: [require('@tailwindcss/typography', '@tailwindcss/forms')],
};
