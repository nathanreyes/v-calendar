<template>
<b-table
  :data='props'>
  <template scope='props'>
    <b-table-column label='Property'>
      <span v-html='props.row.propertyName'></span>
    </b-table-column>
    <b-table-column label='Description'>
      <span v-html='props.row.description'></span>
    </b-table-column>
    <b-table-column label='Range'>
      <span v-html='props.row.range'></span>
    </b-table-column>
  </template>
</b-table>
</template>

<script>
export default {
  data() {
    const props = [
      {
        propertyName: '<code>days: Number, Array</code>',
        description: 'Day number from the start or end of the month.',
        range: '1 to 31, <br /> -1 to -31',
      },
      {
        propertyName: '<code>weekdays: Number, Array</code>',
        description: 'Days of the week.',
        range: '1: Sun to 7: Sat',
      },
      {
        propertyName: '<code>ordinalWeekdays: Object ({ Number: Number, Array })</code>',
        description: 'Weekday ordinal position from the start or end of the month.',
        range: '<strong>key:</strong> 1 to 6, <br /> -1 to -6 <br /> <strong>value:</strong> 1: Sun to 7: Sat',
      },
      {
        propertyName: '<code>weeks: Number, Array</code>',
        description: 'Week number from the start or end of the month.',
        range: '1 to 6, <br /> -1 to -6',
      },
      {
        propertyName: '<code>months: Number, Array</code>',
        description: 'Months of the year.',
        range: '1 to 12',
      },
      {
        propertyName: '<code>years: Number, Array</code>',
        description: 'Year numbers.',
        range: '4-digit integer',
      },
      {
        propertyName: '<code>dailyInterval: Number</code>',
        description: 'Interval number of days from the start date (or today when no start date provided).',
        range: 'n > 0',
      },
      {
        propertyName: '<code>weeklyInterval: Number<code>',
        description: 'Interval number of weeks from the start date (or today).',
        range: 'n > 0',
      },
      {
        propertyName: '<code>monthlyInterval: Number</code>',
        description: 'Interval number of months from the start date (or today).',
        range: 'n > 0',
      },
      {
        propertyName: '<code>yearlyInterval: Number</code>',
        description: 'Interval number of years from the start date (or today).',
        range: 'n > 0',
      },
    ];
    return {
      props,
    };
  },
};
</script>
