<template>
<div>
  <b-table
    :data='props'
    :row-class='(row) => row.class'>
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
</div>
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
        name: '<code>trimMaxWeek</code>',
        description: 'By default the calendar shows the max number of weeks (6) for all months. Set this prop to trim the 6th week when not needed.',
        type: 'Boolean',
        default: '<code>false</code>',
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
      {
        name: '<code>dayHeight</code>',
        description: 'Height of the day cell container. Should be large enough to contain content and highlights.',
        type: 'String',
        default: '<code>2.2rem</code>',
      },
      {
        name: '<code>value</code>',
        description: '<span class="tag is-warning">Date Picker</span>Selected date, dates or date range.',
        type: 'Date, Array, Object',
        default: '<code>null</code>',
      },
      {
        name: '<code>selectMode</code>',
        description: '<span class="tag is-warning">Date Picker</span>Selection mode.',
        type: 'String',
        values: '<code>"single"</code>,<br /><code>"multiple"</code>,<br /><code>"range"</code>',
        default: '<code>"single"</code>',
        class: 'is-date-picker',
      },
      {
        name: '<code>dragHighlight</code>',
        description: '<span class="tag is-warning">Date Picker</span>Highlight for the dragged selection. Only valid for "range" select mode.',
        type: 'Object',
        default: '<code>{}</code>',
        class: 'is-date-picker',
      },
      {
        name: '<code>selectHighlight</code>',
        description: '<span class="tag is-warning">Date Picker</span>Highlight for the date selection. Valid for all select modes.',
        type: 'Object',
        default: '<code>{}</code>',
        class: 'is-date-picker',
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
