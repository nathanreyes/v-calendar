<template>
  <div class="example">
    <h3 class="text-sm text-grey-7 font-medium">#254</h3>
    <v-date-picker
      v-model="range"
      mode="range"
      min-date="2019-01-01"
      max-date="2019-01-31"
      is-inline
    />
  </div>
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
