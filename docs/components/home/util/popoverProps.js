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
    name: '<code>content-style: Object</code>',
    description: 'Style to apply to popover content wrapper.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>content-offset: String</code>',
    description: 'Offset distance of the popover content.',
    default: '<code>"10px"</code>',
  },
  {
    name: '<code>visibility: String</code>',
    description: `
      Visibility state of the popover content.
      <br />Use <code>"hover"</code> for automatic control when popover trigger is hovered on non-touch devices or tapped on touch devices.
      <br />Use <code>"focus"</code> for automatic control when popover trigger enters or leaves focus.
      <br />Use <code>"visible"</code> and <code>"hidden"</code> for manual control.
    `,
    default: '<code>"hover"</code>',
  },
  {
    name: '<code>visible-delay: Number</code>',
    description: 'Time in milliseconds to wait before showing popover when directed.',
    default: '<code>200</code>',
  },
  {
    name: '<code>hidden-delay: Number</code>',
    description: 'Time in milliseconds to wait before hiding popover when directed.',
    default: '<code>300</code>',
  },
  {
    name: '<code>force-hidden: Boolean</code>',
    description: `
      If popover visibility is managed (<code>"hover"</code> or <code>"focus"</code>), set this prop to hide the popover until it is retriggered by the user.
      Usually this would happen when the user has performed an action within the popover and it is no longer needed.
      <br /><br />
      <article class='message is-warning'>
        <div class='message-header'>Warning</div>
        <div class='message-body'>
          The sync attribute (<code>force-hidden.sync</code>) is required for this prop in order to properly sync the visibility state.
          Be sure to bind this prop to a data state variable in the parent component.
        </div>
      </article>
    `,
    default: '<code>false</code>',
  },
  {
    name: '<code>force-hidden-delay: Number</code>',
    description: `
      If provided, this delay will override <code>hidden-delay</code> when the popover is forcefully hidden.
      Usually this value will be shorter than <code>hidden-delay</code>, but this is optional.
    `,
    default: '<code>-1</code>',
  },
];
