<template>
  <div class="example">
    <v-calendar :columns="layout.columns" :rows="layout.rows" :is-expanded="layout.isExpanded"/>
  </div>
</template>

<script>
export default {
  computed: {
    layout() {
      return this.$screens({
        default: {
          columns: 1,
          rows: 1,
          isExpanded: true,
        },
        lg: {
          columns: 2,
          rows: 2,
          isExpanded: false,
        },
      });
    },
  },
};
</script>
