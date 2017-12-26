<template>
<b-table
  :data='props'>
  <template slot-scope='props'>
    <b-table-column label='Property'>
      <span v-html='props.row.propertyName'></span>
    </b-table-column>
    <b-table-column label='Description'>
      <span v-html='props.row.description'></span>
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
        propertyName: '<code>height: String</code>',
        description: 'Height of bar.',
        default: '<code>"5px"</code>',
      },
      {
        propertyName: '<code>backgroundColor: String</code>',
        description: 'Background color of bar.',
        default: '<code>"rgba(0, 0, 0, 0.5)"</code>',
      },
      {
        propertyName: '<code>borderColor: String</code>',
        description: 'Border color of bar.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>borderWidth: String</code>',
        description: 'Border width of bar.',
        default: '<code>"0"</code>',
      },
      {
        propertyName: '<code>borderStyle: String</code>',
        description: 'Border style of bar.',
        default: '<code>"solid"</code>',
      },
      {
        propertyName: '<code>opacity: Number</code>',
        description: 'Opacity of bar.',
        default: '<code>1</code>',
      },
    ];
    return {
      props,
    };
  },
};
</script>
