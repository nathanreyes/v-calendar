const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');

// const fs = require('fs');
// const files = fs.readdirSync(
//   path.resolve('./docs/.vuepress/components/github'),
// ).map(p => );

module.exports = {
  title: 'V-Calendar',
  description: 'An elegant calendar and datepicker plugin for Vuejs.',
  // Google analytics
  ga: 'UA-113780759-1',
  head: [['link', { rel: 'icon', href: 'favicon.png' }]],
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
        text: 'Changelog',
        link: '/changelog/v1.0',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: ['', 'attributes', 'datepicker', 'theming-guide'],
        },
      ],
      '/changelog/': [
        {
          title: 'Changelog',
          collapsable: false,
          children: [
            'v0.1',
            'v0.2',
            'v0.3',
            'v0.4',
            'v0.5',
            'v0.6',
            'v0.7',
            'v0.8',
            'v0.9',
            'v1.0',
          ],
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
