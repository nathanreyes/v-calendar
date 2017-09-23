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
        description: 'Key for highlighted region. Keys affect how highlight animations are applied when appearing or disappearing.',
        default: '<code><i>index</i></code>',
      },
      {
        propertyName: '<code>dates: Array[Date, Object]</code>',
        description: 'List of dates or date range objects to span. Date ranges must specify <code>start</code> and <code>end</code> dates.',
        default: '<code>[]</code>',
      },
      {
        propertyName: '<code>height: String</code>',
        description: 'Height of highlighted region.',
        default: '<code>dayContentStyle.height || "1.8rem"</code>',
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
        default: '<code>dayContentStyle.borderRadius || dayContentStyle.height || "1.8rem"</code>',
      },
      {
        propertyName: '<code>color: String</code>',
        description: 'Color in highlighted region.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>fontSize: String</code>',
        description: 'Font size in highlighted region.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>fontWeight: String</code>',
        description: 'Font weight in highlighted region.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>fontDecoration: String</code>',
        description: 'Font decoration in highlighted region.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>zIndex: Number</code>',
        description: 'Highlights are automatically ordered to display the most information possible. For example, when highlights overlap, single date highlights cover date range highlights, and date range highlights with a later start date cover those with an earlier start date. If you would like to force a highlight to cover all others (overriding these rules), assign a <code>zIndex</code> value greater than 0.',
        default: '<code>0</code>',
      }
    ];
    return {
      props,
    };
  },
};
</script>
