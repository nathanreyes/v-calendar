var tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

const colors = [
  'transparent',
  'black',
  'white',
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
];

module.exports = {
  plugins: [
    tailwindcss('./tailwind.config.js'),
    require('autoprefixer'),
    // process.env.NODE_ENV === 'production'
    //   ? purgecss({
    //       content: ['./src/**/*.vue'],
    //       whitelistPatterns: [
    //         ...colors.map(c => new RegExp(`^vc-.*${c}`, 'g')),
    //         /^vc-border/,
    //       ],
    //     })
    //   : '',
  ],
};
