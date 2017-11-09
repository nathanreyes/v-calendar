<template>
<div>
  <b-table
    :data='props'>
    <template scope='props'>
      <b-table-column :style='{minWidth:"280px"}' label='Name'>
        <span v-html='props.row.name'></span>
      </b-table-column>
      <b-table-column label='Description'>
        <span v-html='props.row.description'></span>
      </b-table-column>
      <b-table-column label='Default'>
        <span v-html='props.row.default'></span>
      </b-table-column>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  props: {
    props: Array,
  },
};
</script>

<style lang='sass'>
.tag.is-warning
  margin-right: 10px
</style>
