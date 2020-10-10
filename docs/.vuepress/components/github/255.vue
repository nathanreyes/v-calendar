<template>
  <v-date-picker
    mode="range"
    v-model="dates"
    :columns="2"
    :max-date="maxDate"
    :from-page="fromPage"
    :to-page="toPage"
  />
</template>

<script>
export default {
  githubTitle: `v-date-picker and max-date, from-page, is-double-paned show selectData, not from-page`,
  data() {
    return {
      dates: {
        start: new Date(2019, 0, 9),
        end: new Date(2019, 0, 18),
      },
      fromPage: {
        month: 10,
        year: 2018,
      },
      toPage: {
        month: 11,
        year: 2018,
      },
      maxDate: new Date(),
    };
  },
};
</script>
