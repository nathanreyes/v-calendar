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
        name: '<code>title</code>',
        description: 'Calendar header title.',
        props: '<code>page</code> Object',
      },
    ];
    return {
      props,
    };
  },
};
</script>