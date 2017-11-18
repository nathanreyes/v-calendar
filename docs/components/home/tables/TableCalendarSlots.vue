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
    <b-table-column label='Props (If Scoped)'>
      <span v-html='props.row.props'></span>
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
    ];
    return {
      props,
    };
  },
};
</script>
