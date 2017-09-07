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
        description: 'Key for highlighted region. Keys affect how highlight animations are applied when appearing or disappearing.',
        type: 'String',
      },
      {
        propertyName: '<code>dates</code>',
        description: 'List of dates or date range objects to span. Date ranges must specify <code>start</code> and <code>end</code> dates.',
        type: 'Array',
      },
      {
        propertyName: '<code>height</code>',
        description: 'Height of highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>backgroundColor</code>',
        description: 'Background color in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>borderColor</code>',
        description: 'Border color in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>borderWidth</code>',
        description: 'Border width in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>borderStyle</code>',
        description: 'Border style in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>borderRadius</code>',
        description: 'Border radius in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>color</code>',
        description: 'Color in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>fontSize</code>',
        description: 'Font size in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>fontWeight</code>',
        description: 'Font weight in highlighted region.',
        type: 'String',
      },
      {
        propertyName: '<code>fontDecoration</code>',
        description: 'Font decoration in highlighted region.',
        type: 'String',
      },
    ];
    return {
      props,
    };
  },
};
</script>
