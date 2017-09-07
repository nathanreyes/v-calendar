<template>
<b-table
  :data='props'>
  <template scope='props'>
    <b-table-column label='Property Name'>
      <span v-html='props.row.propertyName'></span>
    </b-table-column>
    <b-table-column label='Description'>
      <span v-html='props.row.description'></span>
    </b-table-column>
    <b-table-column label='Type'>
      <span v-html='props.row.type'></span>
    </b-table-column>
  </template>
</b-table>
</template>

<script>
export default {
  data() {
    const props = [
      {
        propertyName: '<code>key</code>',
        description: 'Key for indicator. Keys affect how highlight animations are applied when appearing or disappearing.',
        type: 'String',
      },
      {
        propertyName: '<code>dates</code>',
        description: 'List of dates where indicator appears.',
        type: 'Array',
      },
      {
        propertyName: '<code>diameter</code>',
        description: 'Diameter of indicator.',
        type: 'String',
      },
      {
        propertyName: '<code>backgroundColor</code>',
        description: 'Background color of indicator.',
        type: 'String',
      },
      {
        propertyName: '<code>borderColor</code>',
        description: 'Border color of indicator.',
        type: 'String',
      },
      {
        propertyName: '<code>borderWidth</code>',
        description: 'Border width of indicator.',
        type: 'String',
      },
      {
        propertyName: '<code>borderStyle</code>',
        description: 'Border style of indicator.',
        type: 'String',
      },
      {
        propertyName: '<code>borderRadius</code>',
        description: 'Border radius of indicator.',
        type: 'String',
      },
    ];
    return {
      props,
    };
  },
};
</script>
