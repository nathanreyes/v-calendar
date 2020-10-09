<template>
  <v-date-picker v-model="date" mode="range" :availableDates="availableDates" />
</template>

<script>
export default {
  githubTitle: `Conflict happening when availableDates and range mode.`,
  data() {
    return {
      date: null,
      availableDates: [
        '2019-05-01',
        '2019-05-03',
        '2019-05-04',
        '2019-05-06',
        '2019-05-07',
        '2019-05-08',
        '2019-05-13',
        '2019-05-15',
        '2019-05-16',
        '2019-05-17',
        '2019-05-18',
        '2019-05-22',
        '2019-05-23',
        '2019-05-24',
        '2019-05-28',
        '2019-05-29',
        '2019-05-30',
      ],
    };
  },
};
</script>
