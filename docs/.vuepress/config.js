const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');

module.exports = {
  title: 'V-Calendar',
  description: 'An elegant calendar and datepicker plugin for Vuejs.',
  // Google analytics
  ga: 'UA-113780759-1',
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: 'Migrations',
        link: '/migrations/',
      },
      // {
      //   text: 'Showcase',
      //   link: '/showcase/',
      // },
      // {
      //   text: 'Tests',
      //   link: '/tests/',
      // },
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: ['', 'attributes', 'datepicker', 'theming-guide'],
        },
      ],
      '/migrations/': [
        {
          title: 'Migrations',
          collapsable: false,
          children: ['v1.0.0-beta.1', 'v0.9.0', 'v0.8.0'],
        },
      ],
      '/api/': [
        {
          title: 'API',
          collapsable: false,
          children: [
            '',
            'defaults',
            'calendar',
            'page-object',
            'day-object',
            'attribute',
            'datepicker',
            'theme-styles',
            'date-patterns',
          ],
        },
      ],
      '/tests/': [
        {
          title: 'Tests',
          children: [''],
        },
      ],
      '/showcase/': [
        {
          title: 'Showcase',
          collapsable: false,
          children: ['', 'github'],
        },
      ],
    },
    // Assumes GitHub. Can also be a full GitLab url.
    repo: 'nathanreyes/v-calendar',
    // if your docs are not at the root of the repo
    docsDir: 'docs',
    // optional, defaults to master
    docsBranch: 'master',
    // defaults to true, set to false to disable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Help me improve this page!',
  },
  postcss: {
    plugins: [
      require('autoprefixer'),
      postcssPresetEnv({
        stage: 3,
        features: { 'nesting-rules': true, 'custom-properties': true },
      }),
    ],
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /tailwind\.css$/,
          use: [
            {
              loader: 'postcss-loader',
              options: {
                indent: 'postcss',
                plugins: [tailwindcss('docs/.vuepress/tailwind.config.js')],
              },
            },
          ],
        },
        {
          test: /tailwind-lib\.css$/,
          use: [
            {
              loader: 'postcss-loader',
              options: {
                indent: 'postcss',
                plugins: [tailwindcss('./tailwind.config.js')],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
  },
};
