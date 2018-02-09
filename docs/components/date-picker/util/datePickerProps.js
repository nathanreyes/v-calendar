export default [
  {
    name: '<code>value: Date, Array[Date], Object</code>',
    description: 'Selected date, dates or date range.',
    default: '<code>null</code>',
  },
  {
    name: '<code>mode: String</code>',
    description: 'Selection mode: <code>"single"</code>, <code>"multiple"</code>, <code>"range"</code>',
    default: '<code>"single"</code>',
  },
  {
    name: '<code>is-required: Boolean</code>',
    description: 'Prevents the **user** from clearing the selected value. Setting `value = null` still allowed through code.',
    default: '<code>false</code>',
  },
  {
    name: '<code>is-inline: Boolean</code>',
    description: 'Displays calendar inline instead of as a popover.',
    default: '<code>false</code>',
  },
  {
    name: '<code>min-date: Date</code>',
    description: 'Minimum date selectable by the user.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>max-date: Date</code>',
    description: 'Maximum date selectable by the user.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>disabled-dates: Array, Date, Object</code>',
    description: 'Disabled dates or date range objects.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>available-dates: Array, Date, Object</code>',
    description: 'Available dates or date range objects. All other dates are disabled.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>input-props: Object</code>',
    description: 'Object with props to apply to the input element. Not applicable for inline date pickers.',
    default: '<a href="https://github.com/nathanreyes/v-calendar/blob/master/src/utils/defaults.js" target="_blank">Reference code</a>',
  },
  {
    name: '<code>date-formatter: Function</code>',
    description: 'Function used to convert a date into text.',
    default: '<code>date => date.toLocaleDateString()</code>',
  },
  {
    name: '<code>date-parser: Function</code>',
    description: 'Function used to parse text into a date.',
    default: '<code>text => new Date(Date.parse(text))</code>',
  },
  {
    name: '<code>tint-color</code>',
    description: 'Background color of the selected and dragged highlighted regions (`opacity: 0.5` for dragged). This setting is overridden by `select-attribute` and `drag-attribute` if specified.',
    default: '<code>"#66B3CC"</code>',
  },
  {
    name: '<code>select-attribute: Object</code>',
    description: 'Attribute to use for the date selection in all modes.',
    default: '<a href="https://github.com/nathanreyes/v-calendar/blob/master/src/utils/defaults.js" target="_blank">Reference code</a>',
  },
  {
    name: '<code>drag-attribute: Object</code>',
    description: 'Attribute to use for the dragged selection in <code>"range"</code> mode.',
    default: '<a href="https://github.com/nathanreyes/v-calendar/blob/master/src/utils/defaults.js" target="_blank">Reference code</a>',
  },
  {
    name: '<code>show-caps</code>',
    description: 'Show caps and the end of the highlighted and dragged regions when <code>mode === "range"</code>',
    default: '<code>false</code>',
  },
  {
    name: '<code>show-popover</code>',
    description: 'Show popover when selected or dragged date regions are hovered.',
    default: '<code>true</code>',
  },
  {
    name: '<code>popover-expanded</code>',
    description: 'Popover wrapper for input or slot is expanded to the full width of it\'s container.',
    default: '<code>false</code>',
  },
  {
    name: '<code>popover-direction: String</code>',
    description: 'Direction that popover displays relative to input or slot element: <code>"bottom"</code>, <code>"top"</code>, <code>"left"</code>, <code>"right"</code>',
    default: '<code>"bottom"<code>',
  },
  {
    name: '<code>popover-align: String</code>',
    description: 'How the popover is aligned relative to input or slot element: <code>"left"</code>, <code>"right"</code>, <code>"top"</code>, <code>"bottom"</code>',
    default: '<code>"left"</code>',
  },
  {
    name: '<code>popover-visibility: Number</code>',
    description: 'Visibility state of the popover: <code>"hover"</code>, <code>"focus"</code>, <code>"hidden"</code>, <code>"visible"</code>',
    default: '<code>"hover"</code>',
  },
  {
    name: '<code>popover-content-offset: String</code>',
    description: 'Distance that the popover content is offset from the input or slot element',
    default: '<code>"10px"</code>',
  },
  {
    name: '<code>popover-keep-visible-on-input</code>',
    description: 'Keep the popover visible after a valid input has been selected',
    default: '<code>false</code>',
  },
];
