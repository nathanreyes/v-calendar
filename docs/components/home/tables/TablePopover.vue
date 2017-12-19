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
        propertyName: '<code>label: String, Function</code>',
        description: 'Text string (or function that returns a string) to display in the popover content. For functions, <code>attribute</code> is provided as the first parameter and the <code>dayInfo</code> is provided as the second.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>component: Object</code>',
        description: 'Vue component to display in the popover content. Declare <code>attribute</code> and <code>dayInfo</code> props when needed.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>isDark</code>',
        description: 'Displays popover content using the dark style instead of the default light style.',
        default: '<code>false</code>',
      },
      {
        propertyName: '<code>contentStyle</code>',
        description: 'Custom style to use for the popover content.',
        default: '<code>undefined</code>',
      },
      {
        propertyName: '<code>isInteractive</code>',
        description: 'Determines if the user can interact with the popover content.',
        default: '<code>false</code> for labels, <code>true</code> for components',
      }
    ];
    return {
      props,
    };
  },
};
</script>
