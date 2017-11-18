<template>
<div>
  <p class='content'>
    Pages are used to construct calendar months. They appear in slot props and event arguments.
  </p>
  <b-table
    :data='props'>
    <template scope='props'>
      <b-table-column label='Property'>
        <span v-html='props.row.propertyName'></span>
      </b-table-column>
      <b-table-column label='Description'>
        <span v-html='props.row.description'></span>
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
        propertyName: '<code>month: Number</code>',
        description: 'Page month number.',
      },
      {
        propertyName: '<code>year: Number</code>',
        description: 'Page year number.',
      },
      {
        propertyName: '<code>monthLabel: String</code>',
        description: 'Page month label as specified by the <code>monthLabels</code> prop.',
      },
      {
        propertyName: '<code>yearLabel: String</code>',
        description: 'Page year label in <i>YYYY</i> format.',
      },
      {
        propertyName: '<code>yearLabel_2: String</code>',
        description: 'Page year label in <i>YY</i> format.',
      },
      {
        propertyName: '<code>isLeapYear: String</code>',
        description: 'Indicator if page year is a leap year.',
      },
      {
        propertyName: '<code>daysInMonth: Number</code>',
        description: 'Number of days in the page month.',
      },
      {
        propertyName: '<code>firstWeekdayInMonth: Number</code>',
        description: 'Number of the first weekday in the page month.',
      },
      {
        propertyName: '<code>thisMonthComps: Object</code>',
        description: 'Components <code>{ <i>days</i>, <i>month</i>, <i>year</i> }</code> for the today\'s month.',
      },
      {
        propertyName: '<code>prevMonthComps: Object</code>',
        description: 'Components <code>{ <i>days</i>, <i>month</i>, <i>year</i> }</code> for the previous month.',
      },
      {
        propertyName: '<code>nextMonthComps: Object</code>',
        description: 'Components <code>{ <i>days</i>, <i>month</i>, <i>year</i> }</code> for the next month.',
      },
      {
        propertyName: '<code>position: Number</code>',
        description: 'Position of the page. Single Pane: <code>0</code>, Left Pane: <code>1</code>, Right Pane: <code>2</code>',
      },
      {
        propertyName: '<code>move(<i>month</i>, <i>year</i>): Function</code>',
        description: 'Function that moves to a page with a specified month and year.',
      },
      {
        propertyName: '<code>movePrevMonth(): Function</code>',
        description: 'Function that moves to the page for the previous month.',
      },
      {
        propertyName: '<code>moveNextMonth(): Function</code>',
        description: 'Function that moves to the page for the next month.',
      },
      {
        propertyName: '<code>moveThisMonth(): Function</code>',
        description: 'Function that moves to the page for this month.',
      },
    ];
    return {
      props,
    };
  },
};
</script>
