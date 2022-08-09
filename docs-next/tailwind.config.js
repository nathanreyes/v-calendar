/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./docs/.vitepress/components/**/*.{js,ts,vue}', './docs/**/*.md'],
  theme: {
    extend: {
      colors: {
        accent: colors.indigo,
      },
    },
  },
  // plugins: [],
};
