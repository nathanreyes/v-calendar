/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./docs/.vitepress/components/**/*.{js,ts,vue}', './docs/**/*.md'],
  darkMode: 'class',
  theme: {
    colors: {
      ...colors,
      accent: colors.indigo,
    },
  },
  // plugins: [],
};
