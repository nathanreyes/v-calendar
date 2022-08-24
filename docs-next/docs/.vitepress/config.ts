export default {
  title: 'V-Calendar',
  description: 'An elegant calendar and datepicker plugin for Vuejs.',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Examples', link: '/examples/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nathanreyes/v-calendar' },
    ],
    carbonAds: {
      code: 'CE7IK53U',
      placement: 'vcalendario',
    },
    sidebar: {
      '/examples/': [
        {
          text: 'Calendar',
          items: [],
        },
        {
          text: 'Date Picker',
          items: [
            {
              text: 'Date Time Picker With Rules',
              link: '/examples/date-time-rules',
            },
            {
              text: 'Date Time Range Picker With Rules',
              link: '/examples/date-time-range-rules',
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
          collapsible: true,
          items: [
            { text: 'Installation', link: '/getting-started/installation' },
            {
              text: 'Custom Defaults',
              link: '/getting-started/custom-defaults',
            },
            {
              text: 'Upgrade Guide',
              link: '/getting-started/upgrade-guide',
            },
          ],
        },
        // Calendar
        {
          text: 'Calendar',
          collapsible: true,
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
              text: 'Timezones',
              link: '/calendar/timezones',
            },
            {
              text: 'i18n',
              link: '/calendar/i18n',
            },
          ],
        },
        {
          text: 'Date Picker',
          collapsible: true,
          items: [
            {
              text: 'Introduction',
              link: '/datepicker/intro',
            },
            {
              text: 'Time Picker',
              link: '/datepicker/time-picker',
            },
            {
              text: 'Date Types',
              link: '/datepicker/date-types',
            },
            {
              text: 'Popovers',
              link: '/datepicker/popovers',
            },
            {
              text: 'Custom Attributes',
              link: '/datepicker/custom-attributes',
            },
          ],
        },
        {
          text: 'Event Calendar',
          collapsible: true,
          items: [
            { text: 'Introduction', link: '/event-calendar/introduction' },
          ],
        },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2017-present Nathan Reyes',
    },
  },
};
