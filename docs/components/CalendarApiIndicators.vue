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
        propertyName: '<code>key: String</code>',
        description: 'Key for indicator. Keys affect how highlight animations are applied when appearing or disappearing.',
        default: '<code><i>index</i></code>',
      },
      {
        propertyName: '<code>dates: Array[Date]</code>',
        description: 'List of dates where indicator appears.',
        default: '<code>[]</code>',
      },
      {
        propertyName: '<code>diameter: String</code>',
        description: 'Diameter of indicator.',
        default: '<code>"5px"</code>',
      },
      {
        propertyName: '<code>backgroundColor: String</code>',
        description: 'Background color of indicator.',
        default: '<code>"rgba(0, 0, 0, 0.5)"</code>',
      },
      {
        propertyName: '<code>borderColor: String</code>',
        description: 'Border color of indicator.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>borderWidth: String</code>',
        description: 'Border width of indicator.',
        default: '<code>"0"</code>',
      },
      {
        propertyName: '<code>borderStyle: String</code>',
        description: 'Border style of indicator.',
        default: '<code>"solid"</code>',
      },
      {
        propertyName: '<code>borderRadius: String</code>',
        description: 'Border radius of indicator.',
        default: '<code>"50%"<code>',
      },
    ];
    return {
      props,
    };
  },
};
</script>
