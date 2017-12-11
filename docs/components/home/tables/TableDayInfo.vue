<template>
<div>
  <p class='content'>
    Day info objects are passed along with day related events (<code>daySelect</code>, <code>dayMouseEnter</code>, <code>dayMouseLeave</code>).
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
        propertyName: '<code>dayFromEnd: Number</code>',
        description: 'Day number from the end of the month (1-31).',
      },
      {
        propertyName: '<code>weekday: Number</code>',
        description: 'Day weekday number (1-7, Sun-Sat).',
      },
      {
        propertyName: '<code>weekdayOrdinal: Number</code>',
        description: 'Weekday ordinal position from the start of the month (1-6).',
      },
      {
        propertyName: '<code>weekdayOrdinalFromEnd: Number</code>',
        description: 'Weekday ordinal position from the end of the month (1-6).',
      },
      {
        propertyName: '<code>week: Number</code>',
        description: 'Week number from the start of the month (1-6).',
      },
      {
        propertyName: '<code>weekFromEnd: Number</code>',
        description: 'Week number from the end of the month (1-6).',
      },
      {
        propertyName: '<code>month: Number</code>',
        description: 'Month number (1-12).',
      },
      {
        propertyName: '<code>year: Number</code>',
        description: 'Year number.',
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
        propertyName: '<code>attributes: Array</code>',
        description: 'Attributes associated with the day.',
      },
    ];
    return {
      props,
    };
  },
};
</script>
