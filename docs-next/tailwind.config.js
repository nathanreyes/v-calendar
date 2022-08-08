/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./components/**/*.{js,ts,vue}', './**/*.md'],
  theme: {
    extend: {
      colors: {
        accent: colors.indigo,
      },
    },
  },
  // plugins: [],
};
