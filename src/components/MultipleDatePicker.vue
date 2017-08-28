<template>
<calendar
  :highlights='highlights'
  v-bind='$attrs'
  v-on='$listeners'
  @dayClick='selectDay'>
</calendar>
</template>

<script>
import Calendar from './Calendar';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Array, default: [] },
  },
  computed: {
    hasValues() {
      return Array.isArray(this.value) && this.value.length > 0;
    },
    valueTimes() {
      if (!this.hasValues) return [];
      return this.value.map(v => v.getTime());
    },
    highlights() {
      return this.hasValues ? [
        {
          dates: this.value,
          backgroundColor: '#fafafa',
          color: '#333333',
        },
      ] :
      [];
    },
  },
  methods: {
    selectDay(day) {
      // Check if no values exist
      if (!this.hasValues) {
        this.$emit('input', [day.date]);
      // Check if value contains the selected date
      } else if (this.valueTimes.find(dt => dt === day.dateTime)) {
        this.$emit('input', this.value.filter(v => v.getTime() !== day.dateTime));
      // Value does not contain the selected date
      } else {
        this.$emit('input', [...this.value, day.date]);
      }
    },
  },
};
</script>
