<template>
  <v-date-picker
    v-model="dateRange"
    is-range
    trim-weeks
    title-position="left"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
    @drag="dragValue = $event"
  >
    <template #default="{ inputEvents }">
      <button v-on="inputEvents.start">Click Me</button>
    </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle:
    'Cannot Pass Dynamic Value to :disabled-dates props @next version',
  data() {
    return {
      dateRange: null,
      disabledDates: [],
      dragValue: null,
    };
  },
  computed: {
    minDate() {
      const date = new Date();
      const month = (date.getMonth() - 6) % 12;
      const last = new Date(date.getFullYear(), month + 1, 0);
      if (date.getDate() <= last.getDate()) {
        date.setMonth(month);
      } else {
        date.setMonth(month, last.getDate());
      }
      return date;
    },
    maxDate() {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  },
  watch: {
    dateRange() {
      this.dragValue = null;
    },
    dragValue(val, oldVal) {
      if (val == null) {
        this.disabledDates = [];
      } else if (oldVal == null) {
        const { start } = val;
        const rangeStart = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate() - 1,
        );
        const rangeEnd = new Date(
          rangeStart.getFullYear(),
          rangeStart.getMonth(),
          rangeStart.getDate() + 6,
        );
        this.disabledDates = [
          {
            start: null,
            end: rangeStart,
          },
          {
            start: rangeEnd,
            end: null,
          },
        ];
      }
    },
  },
};
</script>
