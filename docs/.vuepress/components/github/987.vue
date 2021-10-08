<template>
  <v-calendar
    :disabled-dates="disabledDates"
    :available-dates="availableDates"
    :min-date="minDate"
  />
</template>

<script>
export default {
  githubTitle: 'Date enabling/disabling strategy discussion',
  data() {
    return {
      disabledDates: [{ start: null, end: null }],
      availableDates: [new Date(2021, 0, 15)],
      minDate: new Date(2021, 0, 1),
      minPage: { year: 2021, month: 1 },
    };
  },
};
</script>
