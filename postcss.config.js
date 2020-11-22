const path = require('path');
module.exports = {
  plugins: {
    'postcss-import': {
      resolve(id, basedir) {
        // resolve alias @css, @import '@css/style.css'
        // because @css/ has 5 chars
        if (id.startsWith('@css')) {
          return path.resolve('./src/assets/styles/css', id.slice(5));
        }

        // resolve node_modules, @import '~normalize.css/normalize.css'
        // similar to how css-loader's handling of node_modules
        if (id.startsWith('~')) {
          return path.resolve('./node_modules', id.slice(1));
        }

        // resolve relative path, @import './components/style.css'
        return path.resolve(basedir, id);
      },
    },
    'postcss-simple-vars': {},
    'postcss-nested': {},
    'postcss-url': {},
    autoprefixer: {
      overrideBrowserslist: '> 1%, IE 6, Explorer >= 10, Safari >= 7',
    },
  },
};
