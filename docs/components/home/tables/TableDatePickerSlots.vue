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
    <b-table-column label='Props (If Scoped)'>
      <span v-html='props.row.props'></span>
    </b-table-column>
  </template>
</b-table>
</template>

<script>
export default {
  data() {
    const props = [
      {
        name: '<code><i>default</i></code>',
        description: `
          Default slot to use as the popover anchor for <code>v-date-picker</code>. Most likely will contain the following custom element:
          <br /><code>&lt;input :value="props.inputValue" @change.native="props.updateValue($event.target.value)" /&gt;</code>
          <br />Not applicable to inline date pickers.
        `,
        props: '<code>inputValue: String</code>, <code>updateValue: Function</code>',
      },
    ];
    return {
      props,
    };
  },
};
</script>
