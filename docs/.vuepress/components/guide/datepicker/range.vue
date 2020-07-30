<template>
  <div class="example">
    <v-date-picker v-model="range" is-range />
  </div>
</template>

<script>
export default {
  data() {
    return {
      range: {
        start: new Date(2018, 0, 16), // Jan 16th, 2018
        end: new Date(2018, 0, 19), // Jan 19th, 2018
      },
    };
  },
};
</script>
