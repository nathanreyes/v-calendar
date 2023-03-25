import { version } from '../../package.json';
import { defineConfig } from 'vitepress';
import { fileURLToPath, URL } from 'node:url';
import path from 'path';

function nav() {
  return [
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/nathanreyes/v-calendar/blob/v3/CHANGELOG.md',
        },
        { text: '2.0', link: 'https://v2.vcalendar.io' },
      ],
    },
  ];
}

function sidebar() {
  return {
    '/examples/': [
      {
        text: 'Calendar',
        items: [],
      },
      {
        text: 'Date Picker',
        items: [
          {
            text: 'Time Rules',
            link: '/examples/date-picker-time-rules',
          },
          {
            text: 'Popovers',
            link: '/examples/date-picker-popovers',
          },
          {
            text: 'Footer Content',
            link: '/examples/date-picker-footer',
          },
        ],
      },
      {
        text: 'Event Calendar',
        items: [
          {
            text: 'Event Calendar',
            link: '/examples/event-calendar',
          },
        ],
      },
    ],
    '/': [
      // Getting Started
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/getting-started/installation' },
          {
            text: 'Upgrade Guide',
            link: '/getting-started/upgrade-guide',
          },
        ],
      },
      // Calendar
      {
        text: 'Calendar',
        items: [
          {
            text: 'Theme',
            link: '/calendar/theme',
          },
          {
            text: 'Layouts',
            link: '/calendar/layouts',
          },
          {
            text: 'Navigation',
            link: '/calendar/navigation',
          },
          {
            text: 'Attributes',
            link: '/calendar/attributes',
          },
          {
            text: 'Dates',
            link: '/calendar/dates',
          },
          {
            text: 'API',
            link: '/calendar/api',
          },
        ],
      },
      // Date Picker
      {
        text: 'Date Picker',
        items: [
          {
            text: 'Basics',
            link: '/datepicker/basics',
          },
          {
            text: 'Time Picker',
            link: '/datepicker/time-picker',
          },
          {
            text: 'Time Rules',
            link: '/datepicker/time-rules',
          },
          {
            text: 'Slot Content',
            link: '/datepicker/slot-content',
          },
          {
            text: 'Custom Attributes',
            link: '/datepicker/custom-attributes',
          },
          {
            text: 'API',
            link: '/datepicker/api',
          },
        ],
      },
      {
        text: 'i18n',
        items: [
          {
            text: 'Locales',
            link: '/i18n/locales',
          },
          {
            text: 'Masks',
            link: '/i18n/masks',
          },
          {
            text: 'Timezones',
            link: '/i18n/timezones',
          },
        ],
      },
    ],
  };
}

export default defineConfig({
  title: 'VCalendar',
  description: 'An elegant calendar and datepicker plugin for Vuejs.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
        rel: 'stylesheet',
      },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],
  themeConfig: {
    nav: nav(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nathanreyes/v-calendar' },
    ],
    outline: [2, 3],
    sidebar: sidebar(),
    algolia: {
      appId: 'UBR2AQC4NS',
      apiKey: 'd346a02045eeeb56460d8dfca5b23f35',
      indexName: 'v3-vcalendar',
    },
    carbonAds: {
      code: 'CE7IK53U',
      placement: 'vcalendario',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2017-present Nathan Reyes',
    },
  },
  vite: {
    server: {
      port: 3000,
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './') },
        {
          find: 'v-calendar',
          replacement: path.resolve(__dirname, '../../src'),
        },
        {
          find: /^.*\/VPDoc\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/NRDoc.vue', import.meta.url),
          ),
        },
      ],
    },
  },
});
