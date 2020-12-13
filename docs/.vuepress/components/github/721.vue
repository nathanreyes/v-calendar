<template>
  <div>
    <v-date-picker mode="datetime" v-model="date" :max-date="maxDate" />
    <v-date-picker
      v-model="date"
      mode="datetime"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      :available-dates="availableDates"
    />
  </div>
</template>

<script>
export default {
  githubTitle: 'Weird max-date prop behavour?',
  data() {
    return {
      date: null,
      maxDate: new Date(2020, 10, 14, 12, 0, 0),
      disabledDates: [
        { start: new Date(2020, 10, 1), end: new Date(2020, 10, 12) },
      ],
      availableDates: [new Date(2020, 10, 8), new Date(2020, 10, 26)],
    };
  },
};
</script>
