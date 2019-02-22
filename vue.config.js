const path = require('path');

module.exports = {
  css: {
    extract: true,
  },
  outputDir: 'lib',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
  },
};
