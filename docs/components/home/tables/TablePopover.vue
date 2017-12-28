<template>
<b-table
  :data='props'>
  <template slot-scope='{ row }'>
    <b-table-column label='Property'>
      <span v-html='row.propertyName'></span>
    </b-table-column>
    <b-table-column label='Description'>
      <span v-html='row.description'></span>
    </b-table-column>
    <b-table-column label='Default'>
      <span v-html='row.default'></span>
    </b-table-column>
  </template>
</b-table>
</template>

<script>
export default {
  data() {
    const props = [
      {
        propertyName: '<code>label: String, Function</code>',
        description: 'Text string (or function that returns a string) to display in the popover content row. For functions, <code>attribute</code> is provided as the first parameter and the <code>dayInfo</code> is provided as the second.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>labelStyle: Object, Function</code>',
        description: 'Label style object (or function that return an object).  For functions, <code>attribute</code> is provided as the first parameter and the <code>dayInfo</code> is provided as the second.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>hideIndicator: Boolean</code>',
        description: 'Hides the indicator symbol on the left side of the popover content row.',
        default: '<code>false</code>',
      },
      {
        propertyName: '<code>slot: String</code>',
        description: 'Name of slot to use to display in the popover content row.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>visibility: String</code>',
        description: 'Visibility of the popover when this label or slot is displayed (<code>"hover"</code>, <code>"focus"</code>, <code>"visible"</code>, <code>"hidden"</code>).',
        default: '<code>"hover"</code>',
      },
      {
        propertyName: '<code>isInteractive: Boolean</code>',
        description: 'Determines if the user can interact with the popover content. If two or more popovers conflict, <code>true</code> overrides.',
        default: '<code>false</code>',
      },
    ];
    return {
      props,
    };
  },
};
</script>
