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
    <b-table-column label='Parameters'>
      <span v-html='props.row.parameters'></span>
    </b-table-column>
  </template>
</b-table>
</template>

<script>
export default {
  data() {
    const props = [
      {
        name: '—',
        description: '<strong>...All calendar events are forwarded.</strong>',
        parameters: '—',
      },
      {
        name: '<code>input</code>',
        description: 'New date was selected.',
        parameters: '<code>value</code> Date, Array, Object',
      },
      {
        name: '<code>drag</code>',
        description: 'Dragged selection was updated. Only valid for "range" selection mode.',
        parameters: '<code>range</code> Object',
      },
    ];
    return {
      props,
    };
  },
};
</script>
