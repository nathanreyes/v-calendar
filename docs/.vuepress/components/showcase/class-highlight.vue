<template>
  <v-date-picker
    v-model="date"
    :select-attribute="selectAttribute"
    :drag-attribute="dragAttribute"
    is-range
  />
</template>

<script>
export default {
  data() {
    return {
      date: null,
      selectAttribute: {
        contentClass: 'select-drag',
        highlight: null,
      },
      dragAttribute: {
        contentClass: 'select-drag drag',
        highlight: null,
      },
    };
  },
};
</script>

<style>
/* .c-pane-container /deep/ {
  .select-drag.c-day {
    background-color: blue;
    color: white;
    &.drag {
      opacity: 0.5;
    }
  }
} */
</style>
