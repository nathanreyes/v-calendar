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
        type: 'Number',
      },
      {
        propertyName: '<code>year: Number</code>',
        description: 'Page year number.',
        type: 'Number',
      },
      {
        propertyName: '<code>monthLabel: String</code>',
        description: 'Page month label as specified by the <code>monthLabels</code> prop.',
        type: 'String',
      },
      {
        propertyName: '<code>yearLabel: String</code>',
        description: 'Page year label in <i>YYYY</i> format.',
        type: 'String',
      },
      {
        propertyName: '<code>yearLabel_2: String</code>',
        description: 'Page year label in <i>YY</i> format.',
        type: 'String',
      },
      {
        propertyName: '<code>isLeapYear: String</code>',
        description: 'Indicator if page year is a leap year.',
        type: 'Boolean',
      },
      {
        propertyName: '<code>daysInMonth: Number</code>',
        description: 'Number of days in the page month.',
        type: 'Number',
      },
      {
        propertyName: '<code>firstWeekdayInMonth: Number</code>',
        description: 'Number of the first weekday in the page month.',
        type: 'Number',
      },
      {
        propertyName: '<code>prevMonthComps: Object</code>',
        description: 'Components <code>{ <i>month</i>, <i>year</i> }</code> for the previous page before the current page.',
        type: 'Object',
      },
      {
        propertyName: '<code>nextMonthComps: Object</code>',
        description: 'Components <code>{ <i>month</i>, <i>year</i> }</code> for the next page after the current page.',
        type: 'Object',
      },
      {
        propertyName: '<code>move(<i>month</i>, <i>year</i>): Function</code>',
        description: 'Function that moves to a page with a specified month and year.',
        type: 'Function',
      },
      {
        propertyName: '<code>movePrevMonth(): Function</code>',
        description: 'Function that moves to the page for the previous month.',
        type: 'Function',
      },
      {
        propertyName: '<code>moveNextMonth(): Function</code>',
        description: 'Function that moves to the page for the next month.',
        type: 'Function',
      },
      {
        propertyName: '<code>moveThisMonth(): Function</code>',
        description: 'Function that moves to the page for this month.',
        type: 'Function',
      },
    ];
    return {
      props,
    };
  },
};
</script>
