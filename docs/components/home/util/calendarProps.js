export default [
  {
    name: '<code>nav-visibility: String</code>',
    description: `
      Visibility state of the navigation panel.
      <br />Use <code>"hover"</code> to automatically show when title is hovered on non-touch devices or tapped on touch devices.
      <br />Use <code>"focus"</code> to automatically show when title enters or leaves focus.
      <br />Use <code>"visible"</code> and <code>"hidden"</code> for manual control.
      `,
  },
  {
    name: '<code>month-labels: Array[String]</code>',
    description: 'Month labels displayed in header.',
    default: '<code>["January",...,"December"]</code>',
    themable: true,
  },
  {
    name: '<code>weekday-labels: Array[String]</code>',
    description: 'Weekday labels displayed in header. Start with Sunday, even if Sunday isn\'t set as the first day of the week.',
    default: '<code>["S", "M", "T", "W", "T", "F", "S", "S"]</code>',
    themable: true,
  },
  // {
  //   name: '<code>first-day-of-week: Number</code>',
  //   description: 'Weekday number (1-7, Sun-Sat) to use as the first day of the week.',
  //   default: '<code>1</code>',
  //   themable: true,
  // },
  {
    name: '<code>from-page: Object</code>',
    description: 'Active page for single paned calendar or the left pane for double paned calendar. Use the <code>.sync</code> modifier for two-way binding.',
    default: '<code>{ month: <i>thisMonth</i>, year: <i>thisMonthYear</i> }</code>',
  },
  {
    name: '<code>to-page: Object</code>',
    description: 'Active page for the right pane for double paned calendar. Use the <code>.sync</code> modifier for two-way binding.',
    default: '<code>{ month: <i>nextMonth</i>, year: <i>nextMonthYear</i> }</code>',
  },
  {
    name: '<code>min-page: Object</code>',
    description: 'Earliest page (<i>month</i>, <i>year</i>) that the user can navigate to.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>max-page: Object</code>',
    description: 'Latest page (<i>month</i>, <i>year</i>) that the user can navigate to.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>is-double-paned: Boolean</code>',
    description: 'Puts two calendars side by side. When window is collapsed only a single calendar is displayed.',
    default: '<code>false</code>',
    themable: true,
  },
  {
    name: '<code>is-expanded: Boolean</code>',
    description: 'Expands calendar or calendars to fill the full width of its container.',
    default: '<code>false</code>',
    themable: true,
  },
  {
    name: '<code>theme-styles: Object</code>',
    description: 'A variety of styles that are used to customize different components of the calendar.',
    default: 'Reference the <a href="/theming">theming</a> page for more details',
    themable: true,
  },
  {
    name: '<code>title-position: String</code>',
    description: 'Position of header title: <code>"left"</code>, <code>"center"</code>, <code>"right"</code>',
    default: '<code>"center"</center>',
    themable: true,
  },
  {
    name: '<code>title-transition: String</code>',
    description: 'Transition type for title when navigating to a new page: <code>"slide-h"</code>, <code>"slide-v"</code>, <code>"fade"</code>, <code>"none"</code>',
    default: '<code>"slide-h"</code>',
    themable: true,
  },
  {
    name: '<code>weeks-transition: String</code>',
    description: 'Transition type for weeks when navigating to a new page: <code>"slide-h"</code>, <code>"slide-v"</code>, <code>"fade"</code>, <code>"none"</code>',
    default: '<code>"slide-h"</code>',
    themable: true,
  },
  {
    name: '<code>attributes: Array[Object]</code>',
    description: 'List of attributes to display in the calendar.',
    default: '<code>[]</code>',
  },
];
