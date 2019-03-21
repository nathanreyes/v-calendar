const path = require('path');
var tailwindcss = require('tailwindcss');

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
          children: [
            '',
            'attributes',
            'datepicker',
            'theming-guide',
            'migration-guide',
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
      tailwindcss('docs/.vuepress/tailwind.config.js'),
      require('autoprefixer'),
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
      },
    },
  },
};
