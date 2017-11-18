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
    name: '<code>disabled-dates: Array</code>',
    description: 'List of disabled dates or date range objects. Date ranges must specify <code>start</code> and <code>end</code> dates.',
    default: '<code>undefined</code>',
  },
  {
    name: '<code>select-attribute: Object</code>',
    description: 'Attribute to use for the date selection in all modes.',
    default: `<code>
    {
      highlight: {
        backgroundColor: '#74a4a4',
        borderWidth: '1px',
        borderColor: '#65999a'
      },
      contentStyle: {
        color: '#fafafa'
      },
      contentHoverStyle: {
        backgroundColor: 'transparent'
      }
    }
    </code>`,
  },
  {
    name: '<code>drag-attribute: Object</code>',
    description: 'Attribute to use for the dragged selection in <code>"range"</code> mode.',
    default: `<code>
    {
      highlight: {
        backgroundColor: '#c1d6d7',
        height: '25px'
      },
      contentStyle: {
        color: '#103456'
      },
      contentHoverStyle: {
        backgroundColor: 'transparent'
      }
    }
    </code>`,
  },
  {
    name: '<code>disabled-attribute: Object</code>',
    description: 'Attribute to use for disabled dates. If specified, you may include dates in this prop and ignore the <code>disabled-dates</code> prop.',
    default: `<code>
    {
      order: 100,
      contentStyle: {
        color: 'red',
        textDecoration: 'line-through'
      },
      contentHoverStyle: {
        cursor: 'not-allowed',
        backgroundColor: 'transparent'
      }
    }
    </code>`,
  },
];
