<template>
  <v-date-picker
    mode="range"
    v-model="date"
    :select-attribute="selectAttribute"
    :drag-attribute="dragAttribute"
    is-inline
  ></v-date-picker>
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
