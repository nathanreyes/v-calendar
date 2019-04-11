const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

// Whitelist Tailwind classes with these colors for theme support
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
    postcssPresetEnv({
      stage: 2,
      features: {
        'nesting-rules': true,
      },
    }),
    tailwindcss('./tailwind.config.js'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production'
      ? purgecss({
          content: ['./src/**/*.vue', './src/**/*.js'],
          extractors: [
            {
              extractor: class {
                static extract(content) {
                  return content.match(/[A-Za-z0-9-_:/]+/g) || [];
                }
              },
              extensions: ['vue', 'js'],
            },
          ],
          whitelistPatterns: [
            ...colors.map(c => new RegExp(`^vc-.*${c}`, 'g')),
            /^vc-border/,
          ],
        })
      : '',
  ],
};
