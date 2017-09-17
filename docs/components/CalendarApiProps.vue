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
        name: '<code>monthLabels: Array[String]</code>',
        description: 'Month labels displayed in header.',
        default: '<code>["January",...,"December"]</code>',
      },
      {
        name: '<code>weekdayLabels: Array[String]</code>',
        description: 'Weekday labels displayed in header. Start with Sunday, even if it isn\'t set as the first day of the week',
        default: '<code>["S", "M", "T", "W", "T", "F", "S", "S"]</code>',
      },
      {
        name: '<code>firstDayOfWeek: Number</code>',
        description: 'Weekday number (1-7, Sun-Sat) to use as the first day of the week.',
        default: '<code>1</code>',
      },
      {
        name: '<code>fromPage: Object</code>',
        description: 'Active page for single paned calendar or the left pane for double paned calendar. Use the <code>.sync</code> modifier for two-way binding.',
        default: '<code>{ month: <i>thisMonth</i>, year: <i>thisMonthYear</i> }</code>',
      },
      {
        name: '<code>toPage: Object</code>',
        description: 'Active page for the right pane for double paned calendar. Use the <code>.sync</code> modifier for two-way binding.',
        default: '<code>{ month: <i>nextMonth</i>, year: <i>nextMonthYear</i> }</code>',
      },
      {
        name: '<code>minPage: Object</code>',
        description: 'Earliest page (<i>month</i>, <i>year</i>) that the user can navigate to.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>maxPage: Object</code>',
        description: 'Latest page (<i>month</i>, <i>year</i>) that the user can navigate to.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>isDoublePaned: Boolean</code>',
        description: 'Puts two calendars side by side.',
        default: '<code>false</code>',
      },
      {
        name: '<code>highlights: Array[Object]</code>',
        description: 'List of highlighted calendar dates and/or date ranges.',
        default: '<code>[]</code>',
      },
      {
        name: '<code>indicators: Array[Object]</code>',
        description: 'List of calendar indicators.',
        default: '<code>[]</code>',
      },
      {
        name: '<code>indicatorsOffset: String',
        description: 'Offset margin of indicators from bottom of day cell.',
        default: '<code>"0"</code>',
      },
      {
        name: '<code>class: Object</code>, <code>style: Object</code>',
        description: 'Typical class and style props. Used for calendar wrapper.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>headerStyle: Object</code>',
        description: 'Style for calendar header.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>arrowStyle: Object</code>',
        description: 'Style for calendar header arrows.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>titleStyle: Object</code>',
        description: 'Style for calendar header title.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>titleTransition: String</code>',
        description: 'Transition type for title when navigating to a new page: <code>"slide"</code>, <code>"fade"</code>, <code>"none"</code>',
        default: '<code>"slide"</code>',
      },
      {
        name: '<code>weekdayStyle: Object</code>',
        description: 'Style for weekday labels.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>weeksTransition: String</code>',
        description: 'Transition type for weeks when navigating to a new page: <code>"slide"</code>, <code>"fade"</code>, <code>"none"</code>',
        default: '<code>"slide"</code>',
      },
      {
        name: '<code>dayContentStyle: Object</code>',
        description: 'Style for day cell content.',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>dayHeight: String</code>',
        description: 'Height of the day cell container. Should be large enough to contain content and highlights.',
        default: '<code>"2.2rem"</code>',
      },
      {
        name: '<code>value: Date, Array[Date], Object</code>',
        description: '<span class="tag is-warning">Date Picker</span>Selected date, dates or date range.',
        default: '<code>null</code>',
      },
      {
        name: '<code>selectMode: String</code>',
        description: '<span class="tag is-warning">Date Picker</span>Selection mode: <code>"single"</code>, <code>"multiple"</code>, <code>"range"</code>',
        default: '<code>"single"</code>',
      },
      {
        name: '<code>selectHighlight: Object</code>',
        description: '<span class="tag is-warning">Date Picker</span>Highlight for the date selection in all modes.',
        default: '<code>{}</code>',
      },
      {
        name: '<code>dragHighlight: Object</code>',
        description: '<span class="tag is-warning">Date Picker</span>Highlight for the dragged selection in <code>"range"</code> mode.',
        default: '<code>{}</code>',
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
