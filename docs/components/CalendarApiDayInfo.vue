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
        propertyName: '<code>day: Number</code>',
        description: 'Day number (1-31).',
      },
      {
        propertyName: '<code>weekday: Number</code>',
        description: 'Day weekday number (1-7, Sun-Sat).',
      },
      {
        propertyName: '<code>week: Number</code>',
        description: 'Number of week that contains this day (1-6).',
      },
      {
        propertyName: '<code>month: Number</code>',
        description: 'Number of month that contains this day (1-12).',
      },
      {
        propertyName: '<code>year: Number</code>',
        description: 'Number of year that contains this day.',
      },
      {
        propertyName: '<code>date: Date</code>',
        description: 'Date for this day.',
      },
      {
        propertyName: '<code>dateTime: Number</code>',
        description: 'Result of date.getTime() for this day.',
      },
      {
        propertyName: '<code>inMonth: Boolean</code>',
        description: 'Day lies in the currently active month.',
      },
      {
        propertyName: '<code>inPrevMonth: Boolean</code>',
        description: 'Day lies in the month before the currently active month.',
      },
      {
        propertyName: '<code>inNextMonth: Boolean</code>',
        description: 'Day lies in the month after the currently active month.',
      },
      {
        propertyName: '<code>highlights: Array</code>',
        description: 'Highlights associated with the day.',
      },
      {
        propertyName: '<code>indicators: Array</code>',
        description: 'Indicators associated with the day.',
        type: 'Function',
      },
    ];
    return {
      props,
    };
  },
};
</script>
