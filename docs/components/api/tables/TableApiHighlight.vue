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
        propertyName: '<code>animated: Boolean</code>',
        description: 'Highlight is animated on appearing, disappearing or range change.',
        default: '<code>true</code>',
      },
      {
        propertyName: '<code>height: String</code>',
        description: 'Height of highlighted region.',
        default: '<code>"1.8rem"</code>',
      },
      {
        propertyName: '<code>backgroundColor: String</code>',
        description: 'Background color in highlighted region.',
        default: '<code>"rgba(0, 0, 0, 0.5)"</code>',
      },
      {
        propertyName: '<code>borderColor: String</code>',
        description: 'Border color in highlighted region.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>borderWidth: String</code>',
        description: 'Border width in highlighted region.',
        default: '<code>"0"</code>',
      },
      {
        propertyName: '<code>borderStyle: String</code>',
        description: 'Border style in highlighted region.',
        default: '<code>"solid"</code>',
      },
      {
        propertyName: '<code>borderRadius: String</code>',
        description: 'Border radius in highlighted region.',
        default: '<code>"1.8rem"</code>',
      },
    ];
    return {
      props,
    };
  },
};
</script>
