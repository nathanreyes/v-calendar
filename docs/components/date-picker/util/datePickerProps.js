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
    name: '<code>is-inline: Boolean</code>',
    description: 'Displays calendar inline instead of as a popover.',
    default: '<code>false</code>',
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
    default: '<code>"left"<code>',
  },
  {
    name: '<code>popover-visibility: Number</code>',
    description: 'Visibility state of the popover: <code>"hover"</code>, <code>"focus"</code>, <code>"hidden"</code>, <code>"visible"</code>',
    default: '<code>"hover"</code>',
  },
  {
    name: '<code>popover-keep-visible-on-input</code>',
    description: 'Keep the popover visible after a valid input has been selected.',
    default: '<code>false</code>',
  },
  {
    name: '<code>input-class: String</code>',
    description: 'Class to apply to input element. Not applicable for inline date-pickers.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>input-style: Object</code>',
    description: 'Style to apply to input element. Not applicable for inline date-pickers.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>input-placeholder: String</code>',
    description: 'Placeholder to user for input element. Not applicable in for inline date-pickers.',
    default: 'Single: <code>"Enter Date"</code>, Double: <code>"Date 1, Date 2, ..."</code>, Range: <code>"Start Date - End Date"</code>',
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
    name: '<code>disabled-dates: Array, Date, Object</code>',
    description: 'Disabled dates or date range objects. Is date patterns are used input controls become read-only.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>available-dates: Array, Date, Object</code>',
    description: 'Available dates or date range objects. All other dates are disabled. Is date patterns are used input controls become read-only.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>select-color</code>',
    description: 'Background color of the select highlighted region. This setting is overridden by `select-attribute` if specified.',
    default: '<code>"#66B3CC"</code>',
  },
  {
    name: '<code>drag-color</code>',
    description: 'Background color of the dragged highlighted region when <code>mode === "range"</code>. This setting is overridden by `drag-attribute` if specified.',
    default: '<code>"#9FCFDF"</code>',
  },
  {
    name: '<code>show-caps</code>',
    description: 'Show caps and the end of the highlighted and dragged regions when <code>mode === "range"</code>.',
    default: '<code>false</code>',
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
];
