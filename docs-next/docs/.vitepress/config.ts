import { version } from '../../../package.json';

function nav() {
  return [
    { text: 'Guide', link: '/' },
    { text: 'Examples', link: '/examples/' },
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/nathanreyes/v-calendar/blob/master/CHANGELOG.md',
        },
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
        ],
      },
      // Date Picker
      {
        text: 'Date Picker',
        collapsible: true,
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
        ],
      },
      {
        text: 'i18n',
        collapsible: true,
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
      {
        text: 'Event Calendar',
        collapsible: true,
        items: [{ text: 'Introduction', link: '/event-calendar/introduction' }],
      },
    ],
  };
}

export default {
  title: 'VCalendar',
  description: 'An elegant calendar and datepicker plugin for Vuejs.',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  themeConfig: {
    nav: nav(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nathanreyes/v-calendar' },
    ],
    carbonAds: {
      code: 'CE7IK53U',
      placement: 'vcalendario',
    },
    outline: [2, 3],
    sidebar: sidebar(),
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2017-present Nathan Reyes',
    },
  },
};
