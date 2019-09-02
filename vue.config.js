const path = require('path');

module.exports = {
  css: {
    extract: false,
  },
  outputDir: 'lib',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
  },
  lintOnSave: undefined,
};
