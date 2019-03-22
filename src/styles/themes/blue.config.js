let defaultConfig = require('tailwindcss/defaultConfig')();

module.exports = {
  prefix: 'vc',
  theme: {
    colors: defaultConfig.theme.colors.gray,
  },
  variants: {
    backgroundColor: ['hover', 'focus'],
    textColor: ['hover', 'focus'],
  },
};
