<template>
  <v-date-picker
    v-model="date"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    :available-dates="availableDates"
  />
</template>

<script>
export default {
  githubTitle: 'Cannot use minDate/maxDate along with available dates.',
  data() {
    return {
      date: null,
      minDate: new Date(2021, 0, 4),
      maxDate: new Date(2021, 2, 19),
      disabledDates: {},
      availableDates: [
        { start: new Date(2021, 1, 9), end: new Date(2021, 1, 19) },
      ],
    };
  },
};
</script>
