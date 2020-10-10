<template>
  <v-date-picker
    v-model="range"
    mode="range"
    min-date="2019-01-01"
    max-date="2019-01-31"
  />
</template>

<script>
export default {
  githubTitle: `Edge case that hangs the browser on range select: null range, min-date, max-date, is-double-paned`,
  data() {
    return {
      range: { start: null, end: null },
    };
  },
};
</script>
