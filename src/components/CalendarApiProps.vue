<template>
<b-table
  :data='props'>
  <template scope='props'>
    <b-table-column label='Name'>
      <span v-html='props.row.name'></span>
    </b-table-column>
    <b-table-column label='Description'>
      <span v-html='props.row.description'></span>
    </b-table-column>
    <b-table-column label='Type'>
      <span v-html='props.row.type'></span>
    </b-table-column>
    <b-table-column label='Default'>
      <span v-html='props.row.default'></span>
    </b-table-column>
  </template>
</b-table>
</template>

<script>
export default {
  data() {
    const props = [
      {
        name: '<code>page</code>',
        description: 'Active page (month and year). Use the <code>.sync</code> modifier for two-way binding.',
        type: 'Object',
        default: '<code>{ month: <i>thisMonth</i>, year: <i>thisYear</i> }</code>',
      },
      {
        name: '<code>monthLabels</code>',
        description: 'Month labels displayed in header.',
        type: 'Array',
        default: '<code>["January",...,"December"]</code>',
      },
      {
        name: '<code>weekdayLabels</code>',
        description: 'Weekday labels displayed in header.',
        type: 'Array',
        default: '<code>["S", "M", "T", "W", "T", "F", "S", "S"]</code>',
      },
      {
        name: '<code>showMaxWeeks</code>',
        description: 'Show the max number of weeks (6) for all months. Otherwise, just show up to the last week of the month.',
        type: 'Boolean',
        default: '<code>true</code>',
      },
      {
        name: '<code>highlights</code>',
        description: `
          <p class='field'>
            List of highlighted calendar dates and/or date ranges.
          </p>
        `,
        type: 'Array',
        default: '<code>[]</code>',
      },
      {
        name: '<code>wrapperStyle</code>',
        description: 'Style to apply to calendar wrapper.',
        type: 'Object',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>headerStyle</code>',
        description: 'Style to apply to calendar header.',
        type: 'Object',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>weekdayStyle</code>',
        description: 'Style to apply to weekday labels.',
        type: 'Object',
        default: '<code>undefined</code>',
      },
      {
        name: '<code>dayContentStyle</code>',
        description: 'Style to apply to content for day cells.',
        type: 'Object',
        default: '<code>undefined</code>',
      },
    ];
    return {
      props,
    };
  },
};
</script>
