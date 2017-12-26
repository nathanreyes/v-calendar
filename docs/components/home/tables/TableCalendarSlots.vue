<template>
<b-table
  :data='props'>
  <template slot-scope='{ row }'>
    <b-table-column label='Name'>
      <span v-html='row.name'></span>
    </b-table-column>
    <b-table-column label='Description'>
      <span v-html='row.description'></span>
    </b-table-column>
    <b-table-column label='Props (If Scoped)'>
      <span v-html='row.props'></span>
    </b-table-column>
  </template>
</b-table>
</template>

<script>
export default {
  data() {
    const props = [
      {
        name: '<code>header</code>',
        description: 'Calendar header. Use slots below for specific header sections.',
        props: '<code>page: Object</code>',
      },
      {
        name: '<code>header-title</code>',
        description: 'Calendar header title. This slot is animated if animations are enabled.',
        props: '<code>page: Object</code>',
      },
      {
        name: '<code>header-left-button</code>',
        description: 'Calendar header button on the left side.',
        props: '<code>page: Object</code>',
      },
      {
        name: '<code>header-right-button</code>',
        description: 'Calendar header button on the right side.',
        props: '<code>page: Object</code>',
      },
      {
        name: '<code>day-popover-header</code>',
        description: 'If popover content is visible, this slot displays as the header.',
        props: '<code>attributes: Array</code>, <code>day-info: Object</code>',
      }
    ];
    return {
      props,
    };
  },
};
</script>
