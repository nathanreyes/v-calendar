export default [
  {
    name: '<code>is-expanded: Boolean</code>',
    description: 'Expands popover trigger wrapper to fill the full width of its container.',
    default: '<code>false</code>',
  },
  {
    name: '<code>direction: String</code>',
    description: 'Direction that the popover content expands from.',
    default: '<code>"bottom"</code>',
  },
  {
    name: '<code>align: String</code>',
    description: `
      Alignment of popover content.
      <br />Use <code>"left"</code>, <code>"center"</code> or <code>"right"</code> if <code>direction</code> is <code>"bottom"</code> or <code>"top"</code>.
      <br />Use <code>"top"</code>, <code>"middle"</code> or <code>"bottom"</code> if <code>direction</code> is <code>"left"</code> or <code>"right"</code>.
    `,
    default: '<code>"left"</code>',
  },
  {
    name: '<code>visibility</code>',
    description: `
      Visibility state of the popover content.
      <br />Use <code>"hover"</code> for automatic control when popover trigger is hovered on non-touch devices or tapped on touch devices.
      <br />Use <code>"focus"</code> for automatic control when popover trigger enters or leaves focus.
      <br />Use <code>"visible"</code> and <code>"hidden"</code> for manual control.
    `,
    default: '<code>"hover"</code>',
  },
  {
    name: '<code>enter-delay</code>',
    description: 'Time in milliseconds to wait before showing popover when directed.',
    default: '<code>200</code>',
  },
  {
    name: '<code>leave-delay</code>',
    description: 'Time in milliseconds to wait before hiding popover when directed.',
    default: '<code>300</code>',
  },
  {
    name: '<code>content-style</code>',
    description: 'Style to apply to popover content wrapper.',
    default: '<code>undefined</code>',
  },
];
