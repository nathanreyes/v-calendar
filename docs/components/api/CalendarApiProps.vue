<template>
<div>
  <b-table
    :data='props'
    :row-class='(row) => row.class'>
    <template scope='props'>
      <b-table-column :style='{minWidth:"280px"}' label='Name'>
        <span v-html='props.row.name'></span>
      </b-table-column>
      <b-table-column label='Description'>
        <span v-html='props.row.description'></span>
      </b-table-column>
      <b-table-column label='Default'>
        <span v-html='props.row.default'></span>
      </b-table-column>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  data() {
    const props = [
      {
        name: '<code>month-labels: Array[String]</code>',
        description: 'Month labels displayed in header.',
        default: '<code>["January",...,"December"]</code>',
      },
      {
        name: '<code>weekday-labels: Array[String]</code>',
        description: 'Weekday labels displayed in header. Start with Sunday, even if Sunday isn\'t set as the first day of the week',
        default: '<code>["S", "M", "T", "W", "T", "F", "S", "S"]</code>',
      },
      {
        name: '<code>first-day-of-week: Number</code>',
        description: 'Weekday number (1-7, Sun-Sat) to use as the first day of the week.',
        default: '<code>1</code>',
      },
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
      },
      {
        name: '<code>theme-styles: Object</code>',
        description: 'A variety of styles that are used to customize different components of the calendar.',
        default: 'Reference the <a href="/styling">styling</a> page for more details',
      },
      {
        name: '<code>attributes: Array[Object]</code>',
        description: 'List of attributes to display in the calendar.',
        default: '<code>[]</code>',
      },
      {
        name: '<code>title-position: String</code>',
        description: 'Position of header title: <code>"left"</code>, <code>"center"</code>, <code>"right"</code>',
        default: '<code>"center"</center>',
      },
      {
        name: '<code>title-transition: String</code>',
        description: 'Transition type for title when navigating to a new page: <code>"slide-h"</code>, <code>"slide-v"</code>, <code>"fade"</code>, <code>"none"</code>',
        default: '<code>"slide-h"</code>',
      },
      {
        name: '<code>weeks-transition: String</code>',
        description: 'Transition type for weeks when navigating to a new page: <code>"slide-h"</code>, <code>"slide-v"</code>, <code>"fade"</code>, <code>"none"</code>',
        default: '<code>"slide-h"</code>',
      },
      {
        name: '<code>value: Date, Array[Date], Object</code>',
        description: '<span class="tag is-warning">Date Picker</span>Selected date, dates or date range.',
        default: '<code>null</code>',
      },
      {
        name: '<code>mode: String</code>',
        description: '<span class="tag is-warning">Date Picker</span>Selection mode: <code>"single"</code>, <code>"multiple"</code>, <code>"range"</code>',
        default: '<code>"single"</code>',
      },
      {
        name: '<code>is-inline: Boolean</code>',
        description: '<span class="tag is-warning">Date Picker</span>Displays calendar inline instead of as a popover.',
        default: '<code>false</code>',
      },
      {
        name: '<code>popover-direction: String</code>',
        description: '<span class="tag is-warning">Date Picker</span>Direction that popover displays relative to input or slot element: <code>"bottom"</code>, <code>"top"</code>, <code>"left"</code>, <code>"right"</code>',
        default: '<code>"bottom"<code>',
      },
      {
        name: '<code>popover-align: String</code>',
        description: '<span class="tag is-warning">Date Picker</span>How the popover is aligned relative to input or slot element: <code>"left"</code>, <code>"right"</code>, <code>"top"</code>, <code>"bottom"</code>',
        default: '<code>"left"<code>',
      },
      {
        name: '<code>popover-visibility: Number</code>',
        description: '<span class="tag is-warning">Date Picker</span>Visibility state of the popover: Auto: <code>-1</code>, Hidden: <code>0</code>, Visible: <code>1</code>',
        default: 'Auto: <code>-1</code>',
      },
      {
        name: '<code>input-class: String</code>',
        description: '<span class="tag is-warning">Date Picker</span>Class to apply to input element. Not applicable for inline date-pickers.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>input-style: Object</code>',
        description: '<span class="tag is-warning">Date Picker</span>Style to apply to input element. Not applicable for inline date-pickers.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>input-placeholder: String</code>',
        description: '<span class="tag is-warning">Date Picker</span>Placeholder to user for input element. Not applicable in for inline date-pickers.',
        default: 'Single: <code>"Enter Date"</code>, Double: <code>"Date 1, Date 2, ..."</code>, Range: <code>"Start Date - End Date"</code>',
      },
      {
        name: '<code>date-formatter: Function</code>',
        description: '<span class="tag is-warning">Date Picker</span>Function used to convert a date into text.',
        default: '<code>date => date.toLocaleDateString()</code>',
      },
      {
        name: '<code>date-parser: Function</code>',
        description: '<span class="tag is-warning">Date Picker</span>Function used to parse text into a date.',
        default: '<code>text => new Date(Date.parse(text))</code>',
      },
      {
        name: '<code>disabled-dates: Array</code>',
        description: '<span class="tag is-warning">Date Picker</span>List of disabled dates or date range objects. Date ranges must specify <code>start</code> and <code>end</code> dates.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>select-attribute: Object</code>',
        description: '<span class="tag is-warning">Date Picker</span>Attribute to use for the date selection in all modes.',
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
        description: '<span class="tag is-warning">Date Picker</span>Attribute to use for the dragged selection in <code>"range"</code> mode.',
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
        description: '<span class="tag is-warning">Date Picker</span>Attribute to use for disabled dates. If specified, you may include dates in this prop and ignore the <code>disabled-dates</code> prop.',
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
    return {
      props,
    };
  },
};
</script>

<style lang='sass'>
.tag.is-warning
  margin-right: 10px
</style>
