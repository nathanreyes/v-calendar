<template>
  <div>
    <v-date-picker v-model="date" :max-date="maxDate" />
    <v-date-picker
      v-model="date"
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
      maxDate: new Date(),
      disabledDates: {
        start: new Date(2020, 10, 2),
        end: new Date(2020, 10, 14),
      },
      availableDates: new Date(2020, 10, 8),
    };
  },
};
</script>
