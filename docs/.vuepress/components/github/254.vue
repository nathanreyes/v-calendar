<template>
  <v-date-picker
    v-model="range"
    mode="range"
    min-date="2019-01-01"
    max-date="2019-01-31"
    is-inline
  />
</template>

<script>
export default {
  data() {
    return {
      range: { start: null, end: null },
    };
  },
};
</script>
