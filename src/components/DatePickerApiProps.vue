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
    <b-table-column label='Values'>
      <span v-html='props.row.values'></span>
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
        name: '—',
        description: '<strong>...All calendar props are inherited.</strong>',
        type: '—',
        default: '—',
      },
      {
        name: '<code>value</code>',
        description: 'Selected date, dates or date range.',
        type: 'Date, Array, Object',
        default: '<code>null</code>',
      },
      {
        name: '<code>selectMode</code>',
        description: 'Selection mode.',
        type: 'String',
        values: '<code>"single"</code>,<br /><code>"multiple"</code>,<br /><code>"range"</code>',
        default: '<code>"single"</code>',
      },
      {
        name: '<code>dragHighlight</code>',
        description: 'Highlight for the dragged selection. Only valid for "range" select mode.',
        type: 'Array',
        default: '<code>{}</code>',
      },
      {
        name: '<code>selectHighlight</code>',
        description: 'Highlight for the date selection. Valid for all select modes.',
        type: 'Boolean',
        default: '<code>{}</code>',
      },
    ];
    return {
      props,
    };
  },
};
</script>
